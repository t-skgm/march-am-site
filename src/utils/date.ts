import dayjs from 'dayjs'

export const formatDate = (date: dayjs.ConfigType) => dayjs(date).format('YYYY.MM.DD')
