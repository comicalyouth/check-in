function generateRandomGradients() {
  const gradientCount = 8; // 8つのグラデーション
  const colors = ['rgba(233,140,184, 0.5)', 'rgba(11,143,207, 0.5)', 'rgba(237,143,47, 0.5)'];
  const gradients = [];
  const usedPositions = []; // 重複を防ぐための位置管理

  for (let i = 0; i < gradientCount; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // ランダムなサイズを決定（サイズが大きすぎないように制限）
    const size = Math.floor(Math.random() * 10) + 8;  // 20% ~ 50%
    
    let positionX, positionY;
    let overlapDetected = true;
    
    // 重ならない位置を見つけるまで試行
    while (overlapDetected) {
      positionX = Math.floor(Math.random() * 100) + '%';  // 0% ~ 100%
      positionY = Math.floor(Math.random() * 100) + '%';  // 0% ~ 100%

      // 重複位置があれば再試行
      overlapDetected = usedPositions.some(pos => {
        const [prevX, prevY] = pos;
        const distance = Math.sqrt(Math.pow(parseFloat(positionX) - prevX, 2) + Math.pow(parseFloat(positionY) - prevY, 2));
        return distance < 20; // 十分に離れていない場合は重なりとみなす
      });
    }

    // 新しい位置を記録
    usedPositions.push([parseFloat(positionX), parseFloat(positionY)]);
    
    // グラデーションを追加
    gradients.push(`radial-gradient(circle at ${positionX} ${positionY}, ${color} ${size}%, transparent ${size}%)`);
  }

  return gradients.join(', ');
}

function applyBackground() {
  const container = document.querySelector('.dynamic-background');
  const gradients = generateRandomGradients();
  container.style.backgroundImage = gradients;
}

document.oncontextmenu = function(){ return false; };
document.body.oncontextmenu = "return false;"

// 初期設定
window.addEventListener('DOMContentLoaded', () => {
  applyBackground();
});