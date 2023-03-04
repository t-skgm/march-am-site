import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const dayJp = (date: dayjs.ConfigType) => dayjs.tz(date, 'Asia/Tokyo')

export const formatDateJp = (date: dayjs.ConfigType) => dayJp(date).format('YYYY.MM.DD')
