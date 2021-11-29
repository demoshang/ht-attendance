interface CustomAttr {
  id?: string;
  className?: string;
}

function append(ele: HTMLElement) {
  const heads = document.getElementsByTagName('head');
  if (heads.length) {
    heads[0].appendChild(ele);
  } else {
    document.documentElement.appendChild(ele);
  }
}

function insert(ele: HTMLElement) {
  const heads = document.getElementsByTagName('head');
  if (heads.length) {
    heads[0].insertBefore(ele, document.querySelector('script') ?? heads[0].children[0]);
  } else {
    document.documentElement.insertBefore(ele, document.querySelector('script'));
  }
}

function addAttr(ele: HTMLElement, { id, className }: CustomAttr = {}) {
  if (id) {
    ele.id = id;
  }

  if (className) {
    ele.classList.remove(className);
    ele.classList.add(className);
  }
}

function addCss(url: string, attr?: CustomAttr) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', url);

  addAttr(link, attr);
  append(link);
}

function addScript(url: string, attr?: CustomAttr) {
  const script = document.createElement('script');
  script.setAttribute('defer', '');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);
  addAttr(script, attr);

  insert(script);
}

function checkLibLoad() {
  const cssId = 'ht-attendance-bootstrap-css';

  if (!document.querySelector(`#${cssId}`)) {
    addCss('https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.0.2/css/bootstrap.min.css', {
      id: cssId,
    });

    addScript(
      'https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.0.2/js/bootstrap.bundle.min.js',
    );

    // addScript('https://cdn.bootcdn.net/ajax/libs/rxjs/7.3.0/rxjs.umd.min.js');
  }
}

export { checkLibLoad };
