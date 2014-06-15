var request = require('request');
var fs = require('fs');

var path = require('path');

module.exports = function (templatesPath) {
  var files = fs.readdirSync(templatesPath);
  var file0 = path.join(templatesPath, files[0]);
  var contents = fs.readFileSync(file0, 'utf8');

  var blessed = require('blessed');
  var screen = blessed.screen();

  var listWidth = 40;
  var margin = 1;

  var list = blessed.list({
    parent: screen,
    width: listWidth,
    height: screen.height,
    top: 0,
    left: 0,
    align: 'left',
    fg: 'blue',
    border: {
      type: 'line',
      fg: '#00ff00'
    },
    selectedBg: 'green',
    keys: true,
    vi: true
  });

  list.setItems(files);

  list.prepend(new blessed.Text({
    left: 2,
    content: 'Files'
  }));

  list.select(0);

  var box = blessed.scrollabletext({
    parent: screen,
    keys: true,
    vi: true,
    border: {
      type: 'line',
      fg: '#000000'
    },
    scrollbar: {
      fg: 'blue',
      ch: '*'
    },
    width: screen.width - (listWidth + margin),
    height: screen.height,
    top: 0,
    left: listWidth + margin,
    align: 'left',
    content: 'Loading...',
    tags: true
  });

  box.setContent(contents);

  var currentFocus = 'list';
  screen.key('tab', function () {
    if (currentFocus === 'list') {
      box.focus();
      currentFocus = 'box';
      box.style.border.fg = '#00ff00';
      list.style.border.fg = '#000000';
    } else {
      list.focus();
      currentFocus = 'list';
      box.style.border.fg = '#000000';
      list.style.border.fg = '#00ff00';
    }
    screen.render();
  });

  list.key('enter', function (a,b,c) {
    var item = this.getItem(list.selected).content;
    var file = path.join(templatesPath, item);
    var contents = fs.readFileSync(file, 'utf8');
    box.setContent(contents);
    screen.render();
  });

  screen.key('left', function () {
    list.focus();
    currentFocus = 'list';
    box.style.border.fg = '#000000';
    list.style.border.fg = '#00ff00';
    screen.render();
  });

  screen.key('right', function () {
    box.focus();
    currentFocus = 'box';
    box.style.border.fg = '#00ff00';
    list.style.border.fg = '#000000';
    screen.render();
  });

  screen.on('resize', function () {
    box.width = screen.width - (listWidth + margin);
    box.height = screen.height;
    list.height = screen.height;
    list.width = listWidth;
    screen.render();
  });

  screen.key('q', function () {
    process.exit(0);
  });

  screen.render();

};
