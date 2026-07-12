export const confirmDeleteByKeyword = () => {
  const input = window.prompt('削除する場合は「削除」と入力してください。');
  return input === '削除';
};
