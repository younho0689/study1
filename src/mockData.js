// 12강 교육용 가상 데이터: 실제 휴게소나 공식 점검 결과가 아닙니다.
// Supabase 미연결 상태일 때만 이 배열을 사용합니다.
export const mockInspections = [
  { id: 1, rest_area_name: '경부 A휴게소', route: '경부선', inspection_date: '2026-11-10', status: '정상', note: '조명 및 비상구 표지 점검 완료' },
  { id: 2, rest_area_name: '영동 B휴게소', route: '영동선', inspection_date: '2026-11-11', status: '점검 필요', note: '주차장 유도 표지 보완 필요' },
  { id: 3, rest_area_name: '서해안 C휴게소', route: '서해안선', inspection_date: '2026-11-12', status: '정상', note: '소방 설비 점검 완료' },
  { id: 4, rest_area_name: '남해 D휴게소', route: '남해선', inspection_date: '2026-11-13', status: '점검 예정', note: '다음 주 편의시설 점검 예정' },
  { id: 5, rest_area_name: '중부 E휴게소', route: '중부선', inspection_date: '2026-11-14', status: '정상', note: '화장실 및 안내 시설 점검 완료' },
]

export const statusLabels = ['전체', '정상', '점검 필요', '점검 예정']
