import { describe, it, expect } from 'vitest';
import { matchesResource, matchesExcludeResources, filterUrls } from './url-filter';

describe('URL フィルタリング関数のテスト', () => {
  describe('matchesResource', () => {
    it('単一のパスセグメントを持つリソースと一致するURLを正しく識別する', () => {
      expect(matchesResource('https://docs.stripe.com/connect/accounts', 'connect')).toBe(true);
      expect(matchesResource('https://docs.stripe.com/docs/connect', 'connect')).toBe(false);
      expect(matchesResource('https://docs.stripe.com/billing', 'billing')).toBe(true);
    });

    it('複数のパスセグメントを持つリソースと一致するURLを正しく識別する', () => {
      expect(
        matchesResource('https://docs.stripe.com/get-started/account', 'get-started/account')
      ).toBe(true);
      expect(
        matchesResource(
          'https://docs.stripe.com/billing/get-started/account',
          'get-started/account'
        )
      ).toBe(false);
      expect(
        matchesResource('https://docs.stripe.com/get-started/account/setup', 'get-started/account')
      ).toBe(true);
    });
  });

  describe('matchesExcludeResources', () => {
    it('単一のパスセグメントを持つ除外リソースと一致するURLを正しく識別する', () => {
      expect(matchesExcludeResources('https://docs.stripe.com/connect/accounts', ['connect'])).toBe(
        true
      );
      expect(matchesExcludeResources('https://docs.stripe.com/docs/connect', ['connect'])).toBe(
        false
      );
      expect(
        matchesExcludeResources('https://docs.stripe.com/billing', ['connect', 'billing'])
      ).toBe(true);
    });

    it('複数のパスセグメントを持つ除外リソースと一致するURLを正しく識別する', () => {
      expect(
        matchesExcludeResources('https://docs.stripe.com/get-started/account', [
          'get-started/account',
        ])
      ).toBe(true);
      expect(
        matchesExcludeResources('https://docs.stripe.com/billing/get-started/account', [
          'get-started/account',
        ])
      ).toBe(false);
      expect(
        matchesExcludeResources('https://docs.stripe.com/get-started/account/setup', [
          'billing',
          'get-started/account',
        ])
      ).toBe(true);
    });

    it('空の除外リソース配列の場合は常にfalseを返す', () => {
      expect(matchesExcludeResources('https://docs.stripe.com/connect/accounts', [])).toBe(false);
    });
  });

  describe('filterUrls', () => {
    const testUrls = [
      'https://docs.stripe.com/connect/accounts',
      'https://docs.stripe.com/docs/connect',
      'https://docs.stripe.com/billing',
      'https://docs.stripe.com/get-started/account',
      'https://docs.stripe.com/billing/get-started/account',
    ];

    it('リソースが指定されていない場合、すべてのURLを返す', () => {
      expect(filterUrls(testUrls)).toEqual(testUrls);
    });

    it('リソースが指定されている場合、一致するURLのみを返す', () => {
      const filtered = filterUrls(testUrls, 'connect');
      expect(filtered).toEqual(['https://docs.stripe.com/connect/accounts']);
    });

    it('除外リソースが指定されている場合、一致しないURLのみを返す', () => {
      const filtered = filterUrls(testUrls, undefined, ['connect', 'billing']);
      expect(filtered).toEqual([
        'https://docs.stripe.com/docs/connect',
        'https://docs.stripe.com/get-started/account',
      ]);
    });

    it('リソースと除外リソースの両方が指定されている場合、両方の条件を満たすURLのみを返す', () => {
      const filtered = filterUrls(testUrls, 'get-started', ['get-started/account']);
      expect(filtered).toEqual([]);
    });
  });
});
