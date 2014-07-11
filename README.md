scaffoldery
===========
A scaffolding framework inspired by rails, yeoman and component.

## Why
It should be super simple to create templates to automate your own workflow. You should be able to create project specific cutsomizations.


## Installation

`npm install -g scaffoldery`


## Usage

### Create a template

`scaffoldery create` : Create a new template
* Generates `prompts.js`  that exports all prompts that should be asked before scaffolding the templates
* Generates `templates` directory with a sample template
* Updates scaffoldery.json

### Scaffold using a template

`scaffoldery generate <platform> <generator>` generates the templates for the given platform and generator

*Examples*:

`scaffoldery generate angular basic`

`scaffoldery generate javascript hello`


### Install a template

`scaffoldery install <github-repo>` will install a package from the given github repo. The repo needs to have scaffoldery.json initialized by `scaffoldery init`

*Examples*:

`scaffoldery install poojan/scaffold-angular-basic`

`scaffoldery install poojan/scaffold-hello`

`scaffoldery install poojan/scaffold-gen`


### List installed templates

`scaffoldery ls` lists all installed templates

`scaffoldery ls <platform>` lists all installed templates for the given platform

`scaffoldery ls <platform> <generator>` lists all installed templates for the given platform and generator


### Preview a scaffold

`scaffoldery preview <platform> <generator>` previews the templates for the given platform and generator

*Examples*:

`scaffoldery preview angular basic`

`scaffoldery preview javascript hello`


## License

The MIT License (MIT)

Copyright (c) 2014 Kenneth Lynne

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[![Analytics](https://ga-beacon.appspot.com/UA-46835353-1/scaffoldery/README)](https://github.com/igrigorik/ga-beacon)
