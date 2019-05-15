export function navigateTo(path: string, e: React.MouseEvent, history: any) {
  if (e.ctrlKey || e.metaKey) {
    window.open(path);
  } else {
    history.push(path);
  }
}
