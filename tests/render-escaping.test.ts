// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusBanner from '../src/components/StatusBanner.vue'
import StatusGroup from '../src/components/StatusGroup.vue'

// The /api/status snapshot is attacker-influenceable (a compromised platform-probe could inject crafted strings).
// Invariant I2: every API field renders as text via `{{ }}`, never as markup. This proves it for the strings the page renders:
// a group name, a component name and a timestamp.
const XSS = '<img src=x onerror="alert(1)">'

describe('render-escaping (API strings render as text, never markup)', () => {
  it('renders an attacker-supplied component name as inert text, not an element', () => {
    const w = mount(StatusGroup, {
      props: { group: { name: 'Group A', status: 'operational', components: [{ name: XSS, status: 'operational' }] } },
    })
    expect(w.find('img').exists()).toBe(false)
    expect(w.text()).toContain(XSS)
  })

  it('renders an attacker-supplied group name as inert text', () => {
    const w = mount(StatusGroup, { props: { group: { name: XSS, status: 'operational', components: [] } } })
    expect(w.find('img').exists()).toBe(false)
    expect(w.get('h2').text()).toBe(XSS)
  })

  it('renders an unknown status as an empty label rather than markup', () => {
    const w = mount(StatusGroup, {
      props: { group: { name: 'G', status: 'operational', components: [{ name: 'svc', status: '<b>x</b>' as never }] } },
    })
    // No <b> element is created, and an unrecognised status maps to an empty label (never markup).
    expect(w.find('b').exists()).toBe(false)
    expect(w.get('dd').text()).toBe('')
  })

  it('renders a hostile timestamp as text and does not claim a time it cannot read', () => {
    const w = mount(StatusBanner, { props: { overall: 'operational', generatedAt: XSS } })
    expect(w.find('img').exists()).toBe(false)
    expect(w.get('time').text()).toBe('at an unknown time')
  })
})

describe('what the page says about each state (a word, not only a colour)', () => {
  it.each([
    ['operational', 'All systems operational'],
    ['degraded', 'Partial outage'],
    ['down', 'Major outage'],
    ['unknown', 'Status unknown'],
  ] as const)('%s', (overall, headline) => {
    const w = mount(StatusBanner, { props: { overall, generatedAt: '2026-10-08T12:00:00Z' } })
    expect(w.get('output').text()).toContain(headline)
    expect(w.get('output').find('[aria-hidden="true"]').exists()).toBe(true) // the dot is decoration
    expect(w.get('time').attributes('datetime')).toBe('2026-10-08T12:00:00Z')
  })
})
