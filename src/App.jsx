import { useCallback, useEffect, useMemo, useState } from 'react'
import { mockInspections, statusLabels } from './mockData.js'
import { hasSupabaseConfig, supabase } from './lib/supabaseClient.js'

const demoNote = '교육용 가상 데이터입니다. 실제 한국도로공사·휴게소 점검 결과가 아닙니다.'

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const drawings = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    clipboard: <><rect x="5" y="5" width="14" height="16" rx="2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6m-6 4h6"/></>,
    check: <><path d="M20 6 9 17l-5-5"/></>,
    alert: <><circle cx="12" cy="12" r="9"/><path d="M12 8v5m0 3h.01"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.3-4.8L3 9m0-5v5h5M4 13a8 8 0 0 0 14.3 4.8L21 15m0 5v-5h-5"/></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></>,
  }
  return <svg {...common}>{drawings[name] ?? drawings.grid}</svg>
}

function formatDate(value) {
  if (!value) return '-'
  return String(value).slice(0, 10).replaceAll('-', '.')
}

function StatusBadge({ status }) {
  const className = status === '정상' ? 'status-ok' : status === '점검 필요' ? 'status-warn' : 'status-wait'
  return <span className={`status-badge ${className}`}><span className="status-dot" />{status}</span>
}

function SummaryCard({ title, value, icon, tone, subtitle }) {
  return (
    <div className="summary-card">
      <div className="summary-header"><span>{title}</span><span className={`summary-icon icon-${tone}`}><Icon name={icon} size={19}/></span></div>
      <div className="summary-value">{value}<span className="summary-unit">건</span></div>
      <div className="summary-foot">{subtitle}</div>
    </div>
  )
}

function App() {
  const [items, setItems] = useState(hasSupabaseConfig ? [] : mockInspections)
  const [mode, setMode] = useState(hasSupabaseConfig ? 'loading' : 'demo')
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('전체')
  const [updatedAt, setUpdatedAt] = useState(null)

  const loadItems = useCallback(async () => {
    if (!hasSupabaseConfig) {
      setItems(mockInspections)
      setMode('demo')
      setError('')
      setUpdatedAt(new Date())
      return
    }

    setMode('loading')
    setError('')
    try {
      const { data, error: requestError } = await supabase
        .from('rest_area_inspections')
        .select('id, rest_area_name, route, inspection_date, status, note')
        .order('id', { ascending: true })

      if (requestError) throw requestError
      setItems(data ?? [])
      setMode('db')
      setUpdatedAt(new Date())
    } catch (err) {
      setMode('error')
      setItems([]) // DB 오류일 때 가상 데이터를 실제 DB 결과처럼 표시하지 않습니다.
      setError(err instanceof Error ? err.message : 'DB 조회에 실패했습니다.')
    }
  }, [])

  useEffect(() => { void loadItems() }, [loadItems])

  const totals = useMemo(() => ({
    all: items.length,
    ok: items.filter(item => item.status === '정상').length,
    warn: items.filter(item => item.status === '점검 필요').length,
    waiting: items.filter(item => item.status === '점검 예정').length,
  }), [items])

  const filtered = useMemo(() => items.filter(item => {
    const matchesText = `${item.rest_area_name} ${item.route} ${item.note ?? ''}`.toLocaleLowerCase().includes(keyword.trim().toLocaleLowerCase())
    return matchesText && (status === '전체' || item.status === status)
  }), [items, keyword, status])

  const isLoading = mode === 'loading'
  const canShowData = mode === 'demo' || mode === 'db'

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand"><div className="brand-icon"><Icon name="clipboard" size={22}/></div><div><strong>휴게소 시설점검</strong><span>배포 · DB 연결 실습</span></div></div>
          <div className="topbar-right"><span className="topbar-education"><span className="education-dot"/>교육용 데모</span><span className="topbar-sep"/><span className="topbar-version">v1.0</span></div>
        </div>
      </header>

      <main className="container">
        <section className="page-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-line"/> FACILITY INSPECTION DASHBOARD</div>
            <h1>휴게소 시설점검 <span>현황판</span></h1>
            <p className="page-description">노선별 휴게소 시설점검 현황을 확인하고 관리 상태를 한눈에 살펴보세요.</p>
          </div>
          <div className="heading-actions"><button type="button" className="btn-refresh" disabled={isLoading} onClick={() => void loadItems()}><Icon name="refresh" size={17}/>{isLoading ? '조회 중...' : '데이터 새로고침'}</button></div>
        </section>

        <div className={`source-banner ${mode === 'error' ? 'banner-error' : ''}`} role="status" aria-live="polite">
          <span className={`source-icon ${mode === 'db' ? 'source-live' : ''}`}><Icon name="database" size={20}/></span>
          <div className="source-main">
            <strong>{mode === 'db' ? 'Supabase 클라우드 DB 연결됨' : mode === 'loading' ? 'Supabase 데이터를 조회하고 있습니다' : mode === 'error' ? 'Supabase 조회에 실패했습니다' : '현재는 프로젝트 내부의 가상 데이터를 표시합니다'}</strong>
            <span>{mode === 'db' ? 'DB를 수정한 뒤 새로고침 버튼을 눌러 변경사항을 확인해보세요.' : mode === 'demo' ? 'Supabase 프로젝트와 환경변수를 설정하면 같은 화면에 DB 데이터가 표시됩니다.' : mode === 'loading' ? '네트워크 및 접근 권한을 확인하는 중입니다.' : '환경변수, SQL 테이블, RLS 조회 정책을 확인한 뒤 다시 시도하세요.'}</span>
            {mode === 'error' && <code className="error-detail">{error}</code>}
          </div>
          <span className={`source-label ${mode === 'db' ? 'source-label-live' : ''}`}>{mode === 'db' ? 'LIVE DB' : mode === 'error' ? '조회 오류' : mode === 'loading' ? '연결 중' : 'DEMO DATA'}</span>
        </div>

        <section className="summary-section" aria-label="상태별 점검 현황">
          <div className="section-heading"><div><span className="section-kicker">OVERVIEW</span><h2>점검 현황 요약</h2></div><span className="section-hint">현재 조회된 전체 데이터 기준</span></div>
          <div className="summary-grid">
            <SummaryCard title="전체 점검" value={totals.all} icon="grid" tone="blue" subtitle="등록된 전체 점검 기록"/>
            <SummaryCard title="정상" value={totals.ok} icon="check" tone="green" subtitle="점검 완료 · 이상 없음"/>
            <SummaryCard title="점검 필요" value={totals.warn} icon="alert" tone="orange" subtitle="확인 또는 보완 필요"/>
            <SummaryCard title="점검 예정" value={totals.waiting} icon="clock" tone="violet" subtitle="후속 점검 예정"/>
          </div>
        </section>

        <section className="table-section" aria-label="시설점검 목록">
          <div className="table-headline"><div><span className="section-kicker">INSPECTION LOG</span><h2>시설점검 목록</h2><p>검색어와 상태를 선택해 필요한 점검 기록만 확인하세요.</p></div><span className="total-count">총 <strong>{filtered.length}</strong>건 표시</span></div>
          <div className="filters">
            <label className="search-box"><Icon name="search" size={18}/><input aria-label="휴게소 또는 노선 검색" placeholder="휴게소, 노선, 메모 검색" value={keyword} onChange={e => setKeyword(e.target.value)}/></label>
            <div className="status-filters" aria-label="상태 필터">{statusLabels.map(item => <button key={item} type="button" className={`filter-pill ${status === item ? 'active' : ''}`} onClick={() => setStatus(item)} aria-pressed={status === item}>{item}</button>)}</div>
          </div>
          <div className="table-scroll">
            <table>
              <thead><tr><th scope="col">휴게소명</th><th scope="col">노선</th><th scope="col">점검일</th><th scope="col">점검 상태</th><th scope="col">점검 메모</th></tr></thead>
              <tbody>
                {canShowData && filtered.map(item => (
                  <tr key={item.id}>
                    <td className="table-primary">{item.rest_area_name}</td>
                    <td>{item.route}</td>
                    <td className="mono">{formatDate(item.inspection_date)}</td>
                    <td><StatusBadge status={item.status}/></td>
                    <td className="memo">{item.note || '-'}</td>
                  </tr>
                ))}
                {(!canShowData || filtered.length === 0) && <tr><td className="empty-state" colSpan="5">{isLoading ? 'DB 데이터를 불러오는 중입니다...' : mode === 'error' ? 'DB 연결 상태를 확인하고 새로고침을 눌러주세요.' : items.length === 0 ? '표시할 점검 기록이 없습니다.' : '검색 조건에 맞는 기록이 없습니다.'}</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="table-footer"><span><Icon name="shield" size={15}/> {demoNote}</span><span>{updatedAt ? `최종 조회: ${updatedAt.toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit'})}` : '조회 준비 중'}</span></div>
        </section>

        <section className="learning-banner"><div className="learning-icon"><Icon name="arrow" size={22}/></div><div><strong>실습 체크포인트</strong><p>① GitHub에 코드 저장 → ② Vercel 배포 → ③ 제목 수정 후 자동 재배포 → ④ Supabase 연결 → ⑤ DB 값 수정 후 다시 조회</p></div></section>
        <footer className="footer"><span>REST AREA INSPECTION LAB</span><span>12강 배포 및 Supabase 실습용 · 가상 데이터</span></footer>
      </main>
    </div>
  )
}

export default App
