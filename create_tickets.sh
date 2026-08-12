#!/bin/bash

# Create Ticket 1
echo "Creating Ticket 1..."
URL1=$(gh issue create --title "D1: 重構 Layout D 條件渲染" --label "ready-for-agent" --body '## Parent
#17

## What to build
修改 `LayoutFade.jsx`，在沒有上傳圖片時，完全不渲染圖片 DOM (`postImage`) 與漸層遮罩，解決無圖時的髒點與干擾。

## Acceptance criteria
- [ ] 當 `state.image` 為空時，畫面不會渲染圖片 DOM 與遮罩
- [ ] 無圖片時版面維持乾淨純色

## Blocked by
- None — can start immediately')
TICKET1=$(echo "$URL1" | awk -F/ '{print $NF}')
echo "Created: $URL1 (Issue #$TICKET1)"

# Create Ticket 2
echo "Creating Ticket 2..."
URL2=$(gh issue create --title "D2: 重構 Layout D 安全彈性排版" --label "ready-for-agent" --body "## Parent
#17

## What to build
移除 \`LayoutFade.module.css\` 寫死的 \`margin-top: 40%\`，改用 Flex 彈性對齊 (\`justify-content: flex-end\`)，確保內文能隨字數增減自動適應空間，解決文字被擠出畫布的問題。

## Acceptance criteria
- [ ] \`margin-top: 40%\` 已從相關樣式移除
- [ ] 文字排版隨高度彈性往上延伸，絕不超出畫布底部範圍 (1080px)

## Blocked by
- #$TICKET1")
TICKET2=$(echo "$URL2" | awk -F/ '{print $NF}')
echo "Created: $URL2 (Issue #$TICKET2)"

# Create Ticket 3
echo "Creating Ticket 3..."
URL3=$(gh issue create --title "D3: 修正 Layout D 漸層相容性" --label "ready-for-agent" --body "## Parent
#17

## What to build
將 CSS 漸層的 \`transparent\` 替換為具體的 \`rgba(..., 0)\` 值，避免 \`modern-screenshot\` 轉存時出現灰階 Premultiplied Alpha 髒色，並確保通過最終圖片比對驗證。

## Acceptance criteria
- [ ] \`LayoutFade.module.css\` 中所有漸層的 \`transparent\` 皆替換為精確透明色值
- [ ] 轉存 SVG 圖片時無灰階污損出現
- [ ] 下載結果與 Live Preview 100% 吻合

## Blocked by
- #$TICKET2")
TICKET3=$(echo "$URL3" | awk -F/ '{print $NF}')
echo "Created: $URL3 (Issue #$TICKET3)"

# Update Parent Issue
echo "Updating Issue #17 with task list..."
gh issue comment 17 --body "已拆分為以下任務票券：
- [ ] #$TICKET1
- [ ] #$TICKET2
- [ ] #$TICKET3"
