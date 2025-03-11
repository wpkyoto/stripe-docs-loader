/**
 * URLフィルタリングのためのユーティリティ関数
 */

/**
 * URLが指定されたリソースパスと一致するかチェックする
 * @param url チェック対象のURL
 * @param resource リソースパス（単一または複数のパスセグメント）
 * @returns 一致する場合はtrue、それ以外はfalse
 */
export function matchesResource(url: string, resource: string): boolean {
  // URLからホスト名を除去し、パスのみを取得
  const urlPath = new URL(url).pathname;
  // 先頭のスラッシュを除去して最初のパスセグメントを取得
  const pathSegments = urlPath.split('/').filter(Boolean);

  if (resource.includes('/')) {
    // resourceに複数のパスセグメントが含まれる場合（例：'get-started/account'）
    const resourceSegments = resource.split('/').filter(Boolean);
    // 指定されたリソースパスがURLの先頭から始まるか確認
    return resourceSegments.every((segment, index) => pathSegments[index] === segment);
  } else {
    // resourceが単一のパスセグメントの場合（例：'connect'）
    return pathSegments[0] === resource;
  }
}

/**
 * URLが除外リソースのいずれかと一致するかチェックする
 * @param url チェック対象のURL
 * @param excludeResources 除外リソースパスの配列
 * @returns 除外対象の場合はtrue、それ以外はfalse
 */
export function matchesExcludeResources(url: string, excludeResources: string[]): boolean {
  if (!excludeResources || excludeResources.length === 0) {
    return false;
  }

  // URLからホスト名を除去し、パスのみを取得
  const urlPath = new URL(url).pathname;
  // 先頭のスラッシュを除去してパスセグメントを取得
  const pathSegments = urlPath.split('/').filter(Boolean);

  for (const excludeResource of excludeResources) {
    if (excludeResource.includes('/')) {
      // excludeResourceに複数のパスセグメントが含まれる場合（例：'get-started/account'）
      const excludeSegments = excludeResource.split('/').filter(Boolean);
      // 指定された除外パスがURLの先頭から始まるか確認
      const matchesExclude = excludeSegments.every(
        (segment, index) => pathSegments[index] === segment
      );
      if (matchesExclude) {
        return true;
      }
    } else {
      // excludeResourceが単一のパスセグメントの場合（例：'connect'）
      if (pathSegments[0] === excludeResource) {
        return true;
      }
    }
  }

  return false;
}

/**
 * URLをフィルタリングする関数
 * @param urls フィルタリング対象のURL配列
 * @param resource 含めるリソースパス（オプション）
 * @param excludeResources 除外するリソースパスの配列（オプション）
 * @returns フィルタリングされたURL配列
 */
export function filterUrls(
  urls: string[],
  resource?: string,
  excludeResources?: string[]
): string[] {
  if (!resource && (!excludeResources || excludeResources.length === 0)) {
    return urls;
  }

  return urls.filter(url => {
    // リソースが指定されていて、URLがそのリソースと一致しない場合
    if (resource && !matchesResource(url, resource)) {
      return false;
    }

    // 除外リソースが指定されていて、URLがいずれかの除外リソースと一致する場合
    if (excludeResources && matchesExcludeResources(url, excludeResources)) {
      return false;
    }

    return true;
  });
}
