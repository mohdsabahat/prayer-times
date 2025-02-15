![Release](https://github.com/mohdsabahat/prayer-times/actions/workflows/release.yml/badge.svg)
![License](https://img.shields.io/badge/license-LGPLv3-green.svg)

# Prayer Times Calculator

Based on `PrayTimes.js`: Prayer Times Calculator (ver 2.3)

## Future Plans

In future major versions, this library will undergo a significant refactor to enhance usability and performance. The planned improvements include:

- Modernized codebase with better TypeScript support
- Improved API design for easier integration
- Enhanced documentation and examples
- Additional features and customization options

Stay tuned for updates and new releases!

## Overview

PrayTimes.js is originally a JavaScript library for calculating Islamic prayer times. It is developed by Hamid Zarrabi-Zadeh and is distributed under the GNU LGPL v3.0 license.

> This Typescript port by [mohdsabahat](https://github.com/mohdsabahat)

## Features

- Calculate prayer times for any location
- Support for different calculation methods
- Adjustable calculation parameters
- Tune times by given offsets

## Installation

To use PrayerTimes in your project, include the library in your HTML file:

```html
<script src="path/to/build.js"></script>
```

## Usage

### Basic Usage

```javascript
let PT = new PrayerUtils.PrayerTimes('Karachi');
var times = PT.getTimes(new Date(), [43, -80], -5);
console.log('Sunrise = ' + times.sunrise);
```

### Methods

- `getTimes(date, coordinates [, timeZone [, dst [, timeFormat]]])`
- `setMethod(method)` - Set calculation method
- `adjust(parameters)` - Adjust calculation parameters
- `tune(offsets)` - Tune times by given offsets
- `getMethod()` - Get calculation method
- `getSetting()` - Get current calculation parameters
- `getOffsets()` - Get current time offsets
- `adjustAsrMethod()` - Adjust Asr calculation method, accepted values ['Standard', 'Hanafi']

## Documentation

For detailed documentation, please refer to the [User's Manual](http://praytimes.org/manual) and [Calculation Formulas](http://praytimes.org/calculation).

## License

PrayTimes.js is licensed under the GNU LGPL v3.0. For more information, please refer to the license terms.

```
PrayTimes.js: Prayer Times Calculator (ver 2.3)
Copyright (C) 2007-2011 PrayTimes.org

Developer: Hamid Zarrabi-Zadeh
License: GNU LGPL v3.0

TERMS OF USE:
    Permission is granted to use this code, with or
    without modification, in any website or application
    provided that credit is given to the original work
    with a link back to PrayTimes.org.

This program is distributed in the hope that it will
be useful, but WITHOUT ANY WARRANTY.

PLEASE DO NOT REMOVE THIS COPYRIGHT BLOCK.
```
