/** `[^\/#\?]+?` にマッチするように全角文字に置き換える */
export const pathReplacer = (path: string) =>
  path.replace(/\//g, '／').replace(/#/g, '＃').replace(/\?/g, '？')
