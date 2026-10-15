import {
  LETTER_ORDER,
  SYSTEMS,
  letterValues,
  toPersianDigits,
} from '../lib/helper'

const LettersTable = ({ zhZero }: { zhZero: boolean }) => {
  return (
    <div className="table-wrap" role="region" aria-label="جدول ارزش حروف ابجد">
      <table>
        <caption className="sr-only">جدول کامل ارزش حروف ابجد</caption>
        <thead>
          <tr>
            <th scope="col">حرف</th>
            {SYSTEMS.map((system) => (
              <th scope="col" key={system.key}>
                {system.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {LETTER_ORDER.map((ch) => {
            const values = letterValues(ch, zhZero)
            if (!values) return null

            return (
              <tr key={ch}>
                <td className="ch">{ch}</td>
                {SYSTEMS.map((system) => (
                  <td key={system.key}>
                    {toPersianDigits(values[system.key])}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default LettersTable
