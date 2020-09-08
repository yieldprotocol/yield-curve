import ReactGA from 'react-ga'

export const initGA = () => {
  // console.log('GA init')
  ReactGA.initialize(process.env.GATSBY_GA_ID)
}
export const logPageView = () => {
  // console.log(`Logging pageview for ${window.location.pathname}`)
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}
export const logEvent = object => {
  if (object) {
    ReactGA.event(object)
  }
}
export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}