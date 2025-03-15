export const parseUrl = (url?: string, patterns: string[] = []) => {
  // 기본 URL 설정
  if (!url) {
    throw new Error('URL이 제공되지 않았습니다.');
  }

  // URL 파싱하여 pathname 추출
  const parsedUrl = new URL(url);
  const pathname = decodeURI(parsedUrl.pathname);

  // 경로 세그먼트로 분리
  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  // 파라미터를 저장할 객체
  const params: Record<string, string> = {};

  // 이미 처리된 세그먼트를 추적
  const processedSegments = new Set<number>();

  // 세그먼트 문자열 비교 최적화 함수
  const isSegmentMatch = (pattern: string, path: string): boolean => {
    // 길이가 다르면 즉시 불일치로 판단
    if (pattern.length !== path.length) return false;
    return pattern === path;
  };

  // 각 패턴에 대해 처리
  for (const pattern of patterns) {
    // 패턴을 세그먼트로 분리
    const patternSegments = pattern.split('/').filter(segment => segment !== '');

    // 패턴 세그먼트를 경로에 매칭
    for (let i = 0; i <= pathSegments.length - patternSegments.length; i++) {
      // 이미 처리된 세그먼트의 시작점은 건너뜀
      if (processedSegments.has(i)) continue;

      let matched = true;
      const tempParams: Record<string, string> = {};

      // 모든 패턴 세그먼트가 매치되는지 확인
      for (let j = 0; j < patternSegments.length; j++) {
        const patternSeg = patternSegments[j];
        const pathSeg = pathSegments[i + j];

        if (!pathSeg) {
          matched = false;
          break;
        }

        // 파라미터인지 확인
        if (patternSeg.startsWith(':')) {
          const paramName = patternSeg.substring(1);
          tempParams[paramName] = pathSeg;
        }
        // 정확한 문자열 매치 - 최적화된 비교 함수 사용
        else if (!isSegmentMatch(patternSeg, pathSeg)) {
          matched = false;
          break;
        }
      }

      // 매치되었다면 파라미터 추가 및 처리된 세그먼트 기록
      if (matched) {
        Object.assign(params, tempParams);

        // 매칭된 세그먼트를 처리됨으로 표시
        for (let j = 0; j < patternSegments.length; j++) {
          processedSegments.add(i + j);
        }

        // 이 패턴에 대한 처리 완료
        break;
      }
    }
  }

  return params;
};
