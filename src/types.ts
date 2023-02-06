export type OmitTinaSysProps<T> = Omit<
  T,
  '__typename' | '_sys' | '_values' | 'body' | 'id'
>
