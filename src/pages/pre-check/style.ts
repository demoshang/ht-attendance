function addStyle() {
  const ele = document.createElement('style');

  ele.innerHTML = `
#ht-attendance-root .btn-sm {
  font-size: 12px !important;
}
`;

  document.head.appendChild(ele);
}

export { addStyle };
