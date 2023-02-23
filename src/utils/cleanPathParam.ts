/** `[^\/#\?]+?` にマッチするように全角文字に置き換える */
export const cleanPathParam = (path: string) =>
  path.replace(/\//g, '／').replace(/#/g, '＃').replace(/\?/g, '？')
