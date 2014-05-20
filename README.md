scaffoldery
===========

Work in progress - A scaffolding framework inspired by rails and yeoman.

#Why
It should be super simple to create templates to automate your own workflow. You should be able to create project specific cutsomizations.

Simply install it:
`npm install scaffoldery --save` 

#Usage
Run `scaffoldery init` to have it create a `scaffoldery_templates` folder (with an example template).
Create your own templates inside this folder with the folder name being the template name.

Run `scaffoldery generate <template-name>` to have it generate something based on a template.

#How do I install a template?
Run `scaffoldery install <template>` where template can be a bower package or a github repository. This will fetch a copy of the template into the `scaffoldery_templates` folder.

#How do I create a template?
TODO
`scaffoldery create <template-name>` will create a new folder within your scaffoldery_templates folder. Within there will be a `prompts.js` file that exports all prompts that should be asked before scaffolding the template
inside of the templates folder (`scaffoldery_templates/<template-name>/template/`).

#How do I register a template for everyone else to use?
TODO
Create your template as usual.
Register the template as a bower package.

========================

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
