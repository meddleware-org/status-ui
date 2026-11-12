// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import App from '../src/App.vue'

// The words a visitor reads on the page, in each state of the poll. The page shows what the status service sent and, when a poll
// fails, says what it will do: the technical cause (an HTTP status, a malformed body) goes to the console, never onto the page.
const SNAPSHOT = {
  generated_at: '2026-10-08T12:00:00Z',
  overall: 'degraded',
  groups: [{ name: 'Group A', status: 'degraded', components: [{ name: 'Service one', status: 'down' }] }],
}

let wrapper: VueWrapper | undefined
const respond = vi.fn<() => Response>()

beforeEach(() => {
  vi.stubGlobal('fetch', async () => respond())
  vi.spyOn(console, 'warn').mockImplementation(() => undefined)
})
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  respond.mockReset()
})

async function open() {
  wrapper = mount(App, { attachTo: document.body })
  await flushPromises()
  return wrapper
}

const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })

describe('the page', () => {
  it('renders the snapshot as a heading, a status headline and a list of components per group', async () => {
    respond.mockReturnValue(json(SNAPSHOT))
    const w = await open()
    expect(w.get('h1').text()).toBe('Service Status')
    expect(w.get('[aria-label="Overall status"]').text()).toContain('Partial outage')
    expect(w.get('h2').text()).toBe('Group A')
    expect(w.get('dt').text()).toBe('Service one')
    expect(w.get('dd').text()).toBe('Down')
    expect(w.find('br').exists()).toBe(false)
  })

  it('names the company as "Meddleware" in the header and the copyright line', async () => {
    respond.mockReturnValue(json(SNAPSHOT))
    const w = await open()
    expect(w.get('header').text()).toContain('Meddleware')
    expect(w.text()).not.toMatch(/MeddleWare|meddleware\b(?!\.)/)
  })

  it('shows the company mark beside the name in the header, as a decorative image', async () => {
    respond.mockReturnValue(json(SNAPSHOT))
    const w = await open()
    const mark = w.get('header svg.mw-brand-mark')
    expect(mark.attributes('aria-hidden')).toBe('true')
    expect(w.findAll('header svg.mw-brand-mark')).toHaveLength(1)
    expect(w.get('header').text()).toContain('Meddleware')
  })

  it('explains the footer in plain words, with no internal jargon, build variable or script name', async () => {
    respond.mockReturnValue(json(SNAPSHOT))
    const text = (await open()).get('footer').text()
    expect(text).toContain('refreshes itself about every 15 seconds')
    expect(text).toContain('“Unknown” means no result is available yet')
    expect(text).not.toMatch(/server-side|cached|probe|VITE_|checkpoint|indexer/i)
  })
})

describe('the shell', () => {
  it('is the shared tool shell: one visible heading, the note after the copyright line, and no links to tool pages that do not exist', async () => {
    respond.mockReturnValue(json(SNAPSHOT))
    const w = await open()
    expect(w.findAll('h1')).toHaveLength(1)
    expect(w.get('h1').classes()).not.toContain('mw-visually-hidden')
    const footer = w.get('footer')
    expect(footer.find('.note').exists()).toBe(true)
    const text = footer.text()
    expect(text.indexOf('Meddleware')).toBeGreaterThanOrEqual(0)
    expect(text.indexOf('Meddleware')).toBeLessThan(text.indexOf('The platform checks its own services'))
    expect(footer.find('a[href*="docs.meddleware"], a[href*="meddleware.dev"]').exists()).toBe(false)
    expect(w.findAll('header svg.mw-brand-mark')).toHaveLength(1)
  })
})

describe('a failed poll', () => {
  it('with nothing to show is an error that says what happens next, without the technical cause', async () => {
    respond.mockReturnValue(new Response('down', { status: 503 }))
    const w = await open()
    const alert = w.get('[role="alert"]')
    expect(alert.text()).toBe('Could not load the current status. This page will try again automatically.')
    expect(w.text()).not.toMatch(/503|HTTP|unexpected response/i)
    expect(w.text()).not.toContain('All systems operational')
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('the status request failed'))
  })

  it('keeps the last status on screen and says it may be out of date', async () => {
    respond.mockReturnValueOnce(json(SNAPSHOT)).mockReturnValue(new Response('down', { status: 503 }))
    const w = await open()
    expect(w.find('[role="alert"]').exists()).toBe(false)
    document.dispatchEvent(new Event('visibilitychange'))
    await flushPromises()
    expect(w.get('h2').text()).toBe('Group A')
    expect(w.text()).toContain('What is shown is the last status received and may be out of date.')
    expect(w.text()).not.toMatch(/503|HTTP/)
  })

  it('a body that is not a snapshot is an error, never "operational"', async () => {
    respond.mockReturnValue(json({ overall: 'operational' }))
    const w = await open()
    expect(w.text()).toContain('Could not load the current status.')
    expect(w.text()).not.toContain('All systems operational')
  })
})
