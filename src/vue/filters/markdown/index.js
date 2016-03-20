import md from 'marked'

export default function(val) {
  return val ? md(val) : val
}
