# MotorCortex-Threejs

[![Build Status](https://travis-ci.org/kissmybutton/schema-guard.svg?branch=master)](https://travis-ci.org/kissmybutton/sample-project) ![npm (scoped)](https://img.shields.io/npm/v/@kissmybutton/sample-project.svg) [![Coverage Status](https://coveralls.io/repos/github/kissmybutton/sample-project/badge.svg?branch=master)](https://coveralls.io/github/kissmybutton/sample-project?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/kissmybutton/sample-project.svg)](https://greenkeeper.io/)

MotorCortex is a plugin for the motorcortex library that enables the usage of [three.js](https://threejs.org/) as a 3D MotorCortex Clip.

## Installation
```bash
$ npm install motorcortex-threejs
```

```javascript
const MC = require("@kissmybutton/motorcortex");
const threejsPluginDefinition = require("./main");
const threejsPlugin = MC.loadPlugin(threejsPluginDefinition);
```

<!-- Or manually [download](https://google.com) and link `sample-project.min.js` in your HTML: -->

<!-- ```html
<script src="sample-project.min.js"></script>
``` -->
<!-- *-- DELETEME If the library is hosted on a CDN is good to mention it here as well -- DELETEME* -->

## Key Concepts / Features
*-- DELETEME Describe in technical terms the main concepts of the library -- DELETEME* . 
Sample Project exposes three basic methods by the use of which the developer can:
- add numbers
- multiply numbers
- divide numbers
The library uses only native js functions something that's making it extremelly performant and stable, as well as very small (only 2k). 

## Browser compatibility 
| Chrome | Safari | IE / Edge | Firefox | Opera |
| --- | --- | --- | --- | --- |
| 24+ | 6+ | 10+ | 32+ | 15+ |

## Documentation
*-- DELETEME Start from the most basic usage example and go all the way to the most complex by adding only one (or two) features at a time. Notice the links to codepen for each of the examples. This is very important as it allows users play with the library right away -- DELETEME* . 
### Simple integers addition
```javascript
import sampleproject from 'sample-project';

const a = 5;
const b = 6;
const c = sampleproject.add(a, b);
console.log(c); // it gives the result of the addition, 11
```
[open in codepen](http://google.com)

### Floats addition
```javascript
import sampleproject from 'sample-project';

const a = 5.3;
const b = 6.7;
const c = sampleproject.add(a, b);
console.log(c); // it gives the result of the addition, 12
```
[open in codepen](http://google.com)

### Multiple numbers addition
```javascript
import sampleproject from 'sample-project';

const a = 5.3;
const b = 6.7;
const d = 4;
const c = sampleproject.add(a, b, d);
console.log(c); // it gives the result of the addition, 16
```
[open in codepen](http://google.com)

### Simple integers multiplication
```javascript
import sampleproject from 'sample-project';

const a = 5;
const b = 6;
const c = sampleproject.multiply(a, b);
console.log(c); // it gives the result of the , 30
```
[open in codepen](http://google.com)

### Floats multiplication
```javascript
import sampleproject from 'sample-project';

const a = 2.5;
const b = 6;
const c = sampleproject.multiply(a, b);
console.log(c); // it gives the result of the addition, 15
```
[open in codepen](http://google.com)

### Multiple numbers multiplication
```javascript
import sampleproject from 'sample-project';

const a = 2.5;
const b = 6;
const d = 2;
const c = sampleproject.multiply(a, b, d);
console.log(c); // it gives the result of the addition, 30
```
[open in codepen](http://google.com)

## Reference
*-- DELETEME Here goes the reference of the library. A list of the exported methods, params of it -- DELETEME* . 

| Method | params | returns |
| --- | --- | --- |
| add() | a,b,c... any number of numbers (either floats or integers) | the result of the addition of all passed numbers |
| multiply() | a,b,c... any number of numbers (either floats or integers) | the result of the multiplication of all passed numbers |
| divide() | a,b two numbers (either floats or integers) | the result of the division of the passed numbers (a/b) |

## License
[MIT License](https://opensource.org/licenses/MIT)

## Contribute
Contribution instructions


  
  
  
  
  
[![Kiss My Button](https://presskit.kissmybutton.gr/logos/kissmybutton-logo-small.png)](https://kissmybutton.gr) 