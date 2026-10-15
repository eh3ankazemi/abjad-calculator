/**
 * موتور محاسبه ابجد (حساب جمل)
 * سیستم‌ها: کبیر، وسیط، صغیر و کبیر به ترتیب اهل مغرب
 */

export type SystemKey = 'kabir' | 'wasit' | 'saghir' | 'maghribi'

export interface Values {
  kabir: number
  wasit: number
  saghir: number
  maghribi: number
}

export interface LetterResult extends Values {
  ch: string
}

export interface WordResult extends Values {
  word: string
  letters: LetterResult[]
}

export interface AbjadResult {
  totals: Values
  words: WordResult[]
  letterCount: number
  ignored: string[]
  normalized: string
}

export const SYSTEMS: { key: SystemKey; label: string; hint: string }[] = [
  { key: 'kabir', label: 'کبیر', hint: 'جمل کبیر · ۱ تا ۱۰۰۰' },
  { key: 'wasit', label: 'وسیط', hint: 'جدول وسیط' },
  { key: 'saghir', label: 'صغیر', hint: 'باقی‌مانده کبیر بر ۹' },
  { key: 'maghribi', label: 'مغربی', hint: 'کبیر اهل مغرب' },
]

// [کبیر، وسیط، صغیر]  (جدول‌ها بدون تغییر از نسخه قبلی سایت منتقل شده‌اند)
const TABLE: Record<string, [number, number, number]> = {
  ا: [1, 1, 1],
  آ: [1, 1, 1],
  ب: [2, 2, 2],
  پ: [2, 2, 2],
  ج: [3, 3, 3],
  چ: [3, 3, 3],
  د: [4, 4, 4],
  ه: [5, 5, 5],
  و: [6, 6, 6],
  ز: [7, 7, 7],
  ژ: [7, 7, 7],
  ح: [8, 8, 8],
  ط: [9, 9, 0],
  ی: [10, 10, 1],
  ک: [20, 8, 2],
  گ: [20, 8, 2],
  ل: [30, 6, 3],
  م: [40, 4, 4],
  ن: [50, 2, 5],
  س: [60, 0, 6],
  ع: [70, 10, 7],
  ف: [80, 8, 8],
  ص: [90, 6, 0],
  ق: [100, 4, 1],
  ر: [200, 8, 2],
  ش: [300, 6, 3],
  ت: [400, 4, 4],
  ث: [500, 8, 5],
  خ: [600, 0, 6],
  ذ: [700, 4, 7],
  ض: [800, 8, 8],
  ظ: [900, 0, 0],
  غ: [1000, 4, 1],
}

// ترتیب مغربی: فقط حروف زیر با کبیر مشرقی تفاوت دارند
const MAGHRIBI_OVERRIDE: Record<string, number> = {
  ص: 60,
  ض: 90,
  س: 300,
  ش: 1000,
  ظ: 800,
  غ: 900,
}

/** ترتیب نمایش حروف در جدول */
export const LETTER_ORDER = [
  'ا', 'ب', 'پ', 'ج', 'چ', 'د', 'ه', 'و', 'ز', 'ژ', 'ح', 'ط', 'ی', 'ک', 'گ',
  'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض',
  'ظ', 'غ',
]

const DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u200c\u200d]/g
const SEPARATORS = /[\s\u200f\u200e،,.؛;:!؟?()[\]{}«»"'`\-_/\\|…]+/

/** یکسان‌سازی حروف عربی/فارسی و حذف اعراب، کشیده و نیم‌فاصله */
export const normalizeText = (s: string): string =>
  s
    .replace(DIACRITICS, '')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ةۀ]/g, 'ه')
    .replace(/[أإٱ]/g, 'ا')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ی')

export const letterValues = (ch: string, zhZero = false): Values | null => {
  const row = TABLE[ch]
  if (!row) return null
  if (ch === 'ژ' && zhZero) {
    return { kabir: 0, wasit: 0, saghir: 0, maghribi: 0 }
  }
  return {
    kabir: row[0],
    wasit: row[1],
    saghir: row[2],
    maghribi: MAGHRIBI_OVERRIDE[ch] ?? row[0],
  }
}

const emptyValues = (): Values => ({ kabir: 0, wasit: 0, saghir: 0, maghribi: 0 })

export const calculateAbjad = (
  text: string,
  opts: { zhZero?: boolean } = {}
): AbjadResult => {
  const normalized = normalizeText(text)
  const totals = emptyValues()
  const words: WordResult[] = []
  const ignored = new Set<string>()
  let letterCount = 0

  for (const raw of normalized.split(SEPARATORS)) {
    if (!raw) continue
    const letters: LetterResult[] = []
    const wordTotals = emptyValues()
    for (const ch of Array.from(raw)) {
      const v = letterValues(ch, opts.zhZero)
      if (!v) {
        ignored.add(ch)
        continue
      }
      letters.push({ ch, ...v })
      ;(Object.keys(wordTotals) as SystemKey[]).forEach((k) => {
        wordTotals[k] += v[k]
      })
    }
    if (!letters.length) continue
    letterCount += letters.length
    ;(Object.keys(totals) as SystemKey[]).forEach((k) => {
      totals[k] += wordTotals[k]
    })
    words.push({
      word: letters.map((l) => l.ch).join(''),
      letters,
      ...wordTotals,
    })
  }

  return { totals, words, letterCount, ignored: Array.from(ignored), normalized }
}

/** ریشه عددی (جمع ارقام تا رسیدن به یک رقم) */
export const digitalRoot = (n: number): number =>
  n <= 0 ? 0 : 1 + ((n - 1) % 9)

/** عدد به حروف ابجد کبیر (حریصانه) */
const KABIR_DESC: [number, string][] = [
  [1000, 'غ'], [900, 'ظ'], [800, 'ض'], [700, 'ذ'], [600, 'خ'], [500, 'ث'],
  [400, 'ت'], [300, 'ش'], [200, 'ر'], [100, 'ق'], [90, 'ص'], [80, 'ف'],
  [70, 'ع'], [60, 'س'], [50, 'ن'], [40, 'م'], [30, 'ل'], [20, 'ک'],
  [10, 'ی'], [9, 'ط'], [8, 'ح'], [7, 'ز'], [6, 'و'], [5, 'ه'], [4, 'د'],
  [3, 'ج'], [2, 'ب'], [1, 'ا'],
]

export const numberToLetters = (n: number): string => {
  if (!Number.isFinite(n) || n <= 0 || n > 99999) return ''
  let rest = Math.floor(n)
  let out = ''
  for (const [val, ch] of KABIR_DESC) {
    while (rest >= val) {
      out += ch
      rest -= val
    }
  }
  return out
}

// فهرست کوتاهی از نام‌ها و واژه‌های پرکاربرد برای «هم‌عددیاب»
const DICTIONARY = [
  'محمد', 'علی', 'حسین', 'حسن', 'فاطمه', 'زهرا', 'مریم', 'زینب', 'رضا', 'مهدی',
  'احمد', 'محسن', 'مصطفی', 'ابراهیم', 'اسماعیل', 'یوسف', 'موسی', 'عیسی', 'داود',
  'سلیمان', 'امیر', 'سارا', 'نرگس', 'نازنین', 'آرش', 'کوروش', 'داریوش', 'پویا',
  'سعید', 'حمید', 'مجید', 'جواد', 'کاظم', 'باقر', 'صادق', 'تقی', 'نقی', 'عباس',
  'حیدر', 'سجاد', 'هادی', 'مرتضی', 'حمزه', 'ایمان', 'امین', 'شهاب', 'کامران',
  'بهرام', 'فرهاد', 'شیرین', 'لیلی', 'مجنون', 'عشق', 'غم', 'دل', 'جان', 'امید',
  'صبر', 'شکر', 'مهر', 'وفا', 'نور', 'حق', 'خدا', 'الله', 'رحمان', 'رحیم', 'کریم',
  'عدل', 'مظفر', 'بهار', 'آرزو', 'آرمان', 'ستایش', 'یلدا', 'باران', 'نیلوفر',
  'ثمین', 'نگار', 'ماهان', 'پرهام', 'آریا', 'آرین', 'سینا', 'پارسا', 'کیان',
  'نیما', 'سپهر', 'سروش', 'مهسا', 'مینا', 'الهام', 'ندا', 'پریسا', 'شقایق',
  'هستی', 'رویا', 'افسانه', 'ایران', 'عدالت', 'آزادی', 'زندگی', 'سلام', 'دوست',
  'مادر', 'پدر', 'برادر', 'خواهر', 'عاشق', 'معشوق', 'شاد', 'خوشبخت', 'سعادت',
  'برکت', 'سلامت', 'حکمت', 'علم', 'ادب', 'هنر', 'شعر', 'کتاب', 'قلم',
]

export const findWords = (
  n: number,
  system: SystemKey,
  zhZero = false
): string[] => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const w of DICTIONARY) {
    if (seen.has(w)) continue
    seen.add(w)
    if (calculateAbjad(w, { zhZero }).totals[system] === n) out.push(w)
  }
  return out
}

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

export const toPersianDigits = (v: string | number): string =>
  String(v).replace(/\d/g, (d) => FA_DIGITS[Number(d)])

export const toEnglishDigits = (s: string): string =>
  s
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))

export const formatNumber = (n: number, fa = true): string => {
  const grouped = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, fa ? '٬' : ',')
  return fa ? toPersianDigits(grouped) : grouped
}

/** عدد وارد شده کاربر (فارسی/عربی/لاتین) را به عدد صحیح تبدیل می‌کند */
export const parseNumberInput = (s: string): number | null => {
  const clean = toEnglishDigits(s).replace(/[٬,\s]/g, '')
  if (!/^\d{1,5}$/.test(clean)) return null
  const n = Number(clean)
  return n > 0 ? n : null
}

/** سازگاری با نسخه قبلی: خروجی به‌صورت رشته فارسی */
export const abjadNumber = (value: string) => {
  const { totals } = calculateAbjad(value)
  return {
    num: toPersianDigits(totals.kabir),
    numWc: toPersianDigits(totals.wasit),
    numCgh: toPersianDigits(totals.saghir),
  }
}
