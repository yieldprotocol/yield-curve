import { ethers, BigNumber } from 'ethers'

/* constants */
export const BN_RAY = BigNumber.from('1000000000000000000000000000')
export const N_RAY = '1000000000000000000000000000'
export const WAD = BigNumber.from('1000000000000000000')
export const RAY = BigNumber.from('1000000000000000000000000000')
export const RAD = BigNumber.from('10000000000000000000000000000000000000000')
export const SECONDS_PER_YEAR = 365 * 24 * 60 * 60
export const ETH = ethers.utils.formatBytes32String('ETH-A')
export const CHAI = ethers.utils.formatBytes32String('CHAI')

// / @dev Converts a number to WAD precision, for number up to 10 decimal places
export const toWad = (value) => {
  const exponent = BigNumber.from('10').pow(BigNumber.from('8'))
  return BigNumber.from(value * 10 ** 10).mul(exponent)
}

// / @dev Converts a number to RAY precision, for number up to 10 decimal places
export const toRay = (value) => {
  const exponent = BigNumber.from('10').pow(BigNumber.from('17'))
  return BigNumber.from(value * 10 ** 10).mul(exponent)
}

// / @dev Converts a number to RAD precision, for number up to 10 decimal places
export const toRad = (value) => {
  const exponent = BigNumber.from('10').pow(BigNumber.from('35'))
  return BigNumber.from(value * 10 ** 10).mul(exponent)
}

export const toWei = (value) => {
  return ethers.utils.parseEther(value.toString())
}

// / @dev Adds two numbers
// / I.e. addBN(ray(x), ray(y)) = ray(x - y)
export const addBN = (x, y) => {
  return BigNumber.from(x).add(BigNumber.from(y))
}

// / @dev Substracts a number from another
// / I.e. subBN(ray(x), ray(y)) = ray(x - y)
export const subBN = (x, y) => {
  return BigNumber.from(x).sub(BigNumber.from(y))
}

// / @dev Multiplies a number in any precision by a number in RAY precision, with the output in the first parameter's precision.
// / I.e. mulRay(wad(x), ray(y)) = wad(x*y)
export const mulRay = (x, ray) => {
  const unit = BigNumber.from('10').pow(BigNumber.from('27'))
  return BigNumber.from(x).mul(BigNumber.from(ray)).div(unit)
}

// / @dev Divides a number in any precision by a number in RAY precision, with the output in the first parameter's precision.
// / I.e. divRay(wad(x), ray(y)) = wad(x/y)
export const divRay = (x, ray) => {
  const unit = BigNumber.from('10').pow(BigNumber.from('27'))
  return unit.mul(BigNumber.from(x)).div(BigNumber.from(ray))
}

// @dev Takes a bignumber in RAY and converts it to a human understandalble number
export const rayToHuman = (x) => {
  // const unit = BigNumber.from('10').pow(BigNumber.from('27'));
  return divRay(x, RAY).toString()
}

// @dev Takes a bignumber in WEI, WAD or the like and converts it to human.
// @return {number}
export const wadToHuman = (x) => {
  return parseFloat(ethers.utils.formatEther(x))
}
