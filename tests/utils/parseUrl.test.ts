import { assert, describe, expect, test } from 'vitest';

import { parseUrl } from '../../packages/shared/lib/utils/index.js';

const defaultUrl = 'https://example.com/aaa/123/bbb/456/my-name/ccc/789';

describe('parseUrl', () => {
  test('patterns에 맞게 URL을 파싱한다. - 모두 매칭', () => {
    const patterns = ['/aaa/:a-id/bbb/:b-id', '/ccc/:ccc-id'];
    const params = parseUrl(defaultUrl, patterns);

    expect(params).toEqual({
      'a-id': '123',
      'b-id': '456',
      'ccc-id': '789',
    });
  });

  test('patterns에 맞게 URL을 파싱한다. - 매칭되지 않는 패턴 포함', () => {
    const patterns = ['/aaa/:a-id/abc/bbb/:b-id', '/ccc/:ccc-id'];
    const params = parseUrl(defaultUrl, patterns);

    expect(params).toEqual({
      'ccc-id': '789',
    });
  });

  test('patterns에 맞게 URL을 파싱한다. - 동일한 패턴이 있는 경우 첫번째가 매칭됨', () => {
    const url = 'https://example.com/aaa/123/aaa/456/aaa/789';
    const patterns = ['/aaa/:a-id', '/aaa/:aa-id', '/aaa/:aaa-id'];
    const params = parseUrl(url, patterns);

    expect(params).toEqual({
      'a-id': '123',
      'aa-id': '456',
      'aaa-id': '789',
    });
  });

  test('patterns에 맞게 URL을 파싱한다. - 파라미터가 여러개', () => {
    const url = 'https://example.com/aaa/123/456/789';
    const patterns = ['/aaa/:a-id/:aa-id/:aaa-id'];
    const params = parseUrl(url, patterns);

    expect(params).toEqual({
      'a-id': '123',
      'aa-id': '456',
      'aaa-id': '789',
    });
  });

  test('패턴에 맞지 않는 URL은 빈 객체를 반환한다', () => {
    const params = parseUrl(defaultUrl);

    expect(params).toEqual({});
  });

  test('URL이 없을 때 예외를 처리한다', () => {
    try {
      parseUrl();
      // 여기까지 도달하면 테스트 실패
      assert.fail('URL이 없는데도 예외가 발생하지 않았습니다');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('잘못된 형식의 URL에 대해 예외를 처리한다', () => {
    try {
      parseUrl('invalid-url');
      // 여기까지 도달하면 테스트 실패
      assert.fail('URL이 유효하지 않은데도 예외가 발생하지 않았습니다');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
