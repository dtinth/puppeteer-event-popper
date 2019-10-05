const tkt = require('tkt')
const puppeteer = require('puppeteer')
const axios = require('axios')

async function render(path) {
  const browser = await puppeteer.launch({
    args: ['--single-process', '--no-sandbox', '--disable-dev-shm-usage'],
  })
  try {
    const page = await browser.newPage()
    await page.goto(/:\/\//.test(path) ? path : `file://${require('fs').realpathSync(path)}`)
    const value = await page.evaluate(() => getEventpopDescription())
    return value
  } finally {
    await browser.close()
  }
}

async function main(args) {
  console.log('* Rendering HTML...')
  const html = await render(args.path)
  if (!html) throw new Error('No HTML received.')
  console.log('* Rendered, %d bytes -- updating...', html.length)
  await axios.post(
    `${process.env.EVENT_POPPER_URL}/.netlify/functions/updateEventDescription`,
    {
      apiKey: `${process.env.EVENT_POPPER_API_KEY}`,
      description: html,
    },
  )
  console.log('* Updating done!')
}

require('tkt').cli().command('$0 <path>', 'Deploy description to Eventpop', {
  path: {
    type: 'string',
    desc: 'URL/Path to description file'
  }
}, main).parse()
