import * as core from './core'
import defaults from './options'

const CONFIG_KEY = core.CONFIG_KEY

export default {
  bind: (el, { value }, vnode) => {
    el = core.getInputElement(el)
    const config = core.normalizeConfig(value, value)
    el[CONFIG_KEY] = { config }
    // set initial value
    core.updateValue(el, vnode, { force: config.prefill })
  },

  inserted: (el) => {
    el = core.getInputElement(el)
    const option = el[CONFIG_KEY]
    const { config } = option
    // prefer adding event listener to parent element to avoid Firefox bug which does not
    // execute `useCapture: true` event handlers before non-capturing event handlers
    const handlerOwner = el.parentElement || el

    // use anonymous event handler to avoid inadvertently removing masking for all inputs within a container
    const oninput = (e) => core.inputHandler(e)

    handlerOwner.addEventListener('input', oninput, true)

    el.onblur = (e) => core.blurHandler(e)

    // check decimal key and insert to current element
    // updated cursor position after format the value
    el.onkeydown = (e) => {
      if (e.key === '.' || e.key === config.decimal) {
        e.preventDefault()
        el.setRangeText(config.decimal)
        el.dispatchEvent(new Event('input'))
        core.updateCursor(el, el.value.indexOf(config.decimal) + 1)
      }
    }

    option.cleanup = () => handlerOwner.removeEventListener('input', oninput, true)
  },

  update: (el, { value, oldValue }, vnode) => {
    el = core.getInputElement(el)
    if (value !== oldValue) {
      const { config } = el[CONFIG_KEY]
      el[CONFIG_KEY].config = core.normalizeConfig(config, value)
      core.updateValue(el, vnode, { force: true })
    } else {
      core.updateValue(el, vnode)
    }
  },

  unbind: (el) => {
    core.getInputElement(el)[CONFIG_KEY].cleanup()
  }
}
