# Prayer Times Calculator

> **Note:** This README is based on the original documentation from PrayTimes.js. It will be updated in the future to reflect changes specific to this port.
PrayTimes.js: Prayer Times Calculator (ver 2.3)

## Overview

PrayTimes.js is a JavaScript library for calculating Islamic prayer times. It is developed by Hamid Zarrabi-Zadeh and is distributed under the GNU LGPL v3.0 license.

## Features

- Calculate prayer times for any location
- Support for different calculation methods
- Adjustable calculation parameters
- Tune times by given offsets

## Installation

To use PrayTimes.js in your project, include the library in your HTML file:

```html
<script src="path/to/PrayTimes.js"></script>
```

## Usage

### Basic Usage

```javascript
var PT = new PrayTimes('ISNA');
var times = PT.getTimes(new Date(), [43, -80], -5);
document.write('Sunrise = ' + times.sunrise);
```

### Methods

- `getTimes(date, coordinates [, timeZone [, dst [, timeFormat]]])`
- `setMethod(method)` - Set calculation method
- `adjust(parameters)` - Adjust calculation parameters
- `tune(offsets)` - Tune times by given offsets
- `getMethod()` - Get calculation method
- `getSetting()` - Get current calculation parameters
- `getOffsets()` - Get current time offsets

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
