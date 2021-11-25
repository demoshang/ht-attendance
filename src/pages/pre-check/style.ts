function addStyle() {
  const ele = document.createElement('style');

  ele.innerHTML = `
#ht-attendance-root .btn-sm {
  font-size: 12px !important;
}

.bs-tooltip-top {
  z-index: 999999;
}
`;

  document.head.appendChild(ele);
}

export { addStyle };
