export function exportToCSV(
  data: Array<Record<string, unknown>>,
  filename: string
) {
  if (!data.length) return
  const keys = Object.keys(data[0])
  const rows = [
    keys.join(';'),
    ...data.map((row) =>
      keys.map((k) => {
        const v = row[k]
        const str = v === null || v === undefined ? '' : String(v)
        return str.includes(';') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      }).join(';')
    ),
  ]
  const blob = new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
