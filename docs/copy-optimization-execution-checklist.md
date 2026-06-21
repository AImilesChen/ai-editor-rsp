# AI Editor RSP 页面级文案优化执行清单

## 执行范围

- 首页 `/`
- Pricing `/pricing`
- Image Editor `/image-editor`
- Header CTA
- Prompt Library cards
- CTA / disabled / processing / result states

## 首页 `/`

### Hero / Generator
- H1 改为：`Generate AI images with ready-made prompts`
- 副标题改为：`Pick a prompt, customize the style, lighting, shot, and size, then create a polished AI image in seconds.`
- 未登录 CTA：`Sign in to generate free`
- 登录后可生成 CTA：`Generate image ({credits} cr)`
- Prompt placeholder：`Describe the image you want to create, or start from a ready prompt below.`
- Preview 未生成标签：`Example result`
- 未生成下载提示：`Generate an image to enable download.`
- 免费权益提示：`3 free credits after sign-in. No payment required. Credits are used only when you generate or edit an image.`

### Prompt Library
- Section H2：`Creator-ready prompts for faster image generation`
- Section 副标题：`Start from tested prompt ideas for portraits, product photos, social posts, study rooms, anime styles, and more.`
- 每张卡主按钮：`Use this prompt`
- 次按钮：`Copy`
- 详情链接保留：`View details →`
- `Use this prompt` 跳转 `/generate?prompt={slug}`，生成页自动填入完整 prompt。

### Pricing Preview
- H2：`Simple credits for AI image generation`
- 增加 free credits 文案：`Start free with 3 credits after sign-in. Upgrade only when you need more image credits.`
- 增加 credit guide：1/2/4 credits 规则。
- Creator 显示 `Most Popular` 并加强边框/阴影。

### FAQ
- 覆盖：free credits、credits 消耗、no card、uploaded image editing、commercial use、Creem checkout。
- 不写 broad commercial license，不写 fake testimonials，不写 unlimited / guaranteed。

## Pricing `/pricing`

- Metadata description 改为 credits / editing / ready prompts。
- Hero H1：`Simple credits for AI image generation`
- Hero 副标题：`Choose a monthly credit plan for generating images, editing uploaded photos, and exploring ready-made prompts.`
- Hero trust line：`Start free with 3 credits after sign-in. Upgrade only when you need more image credits.`
- 套餐上方新增 `How credits work` 框：
  - `1 credit: portrait text-to-image`
  - `2 credits: square or landscape text-to-image, or portrait image edit`
  - `4 credits: square or landscape image edit`
  - `Free credits are available after sign-in. No payment required to try.`
- Plan CTA：`Start free` / `Choose Starter` / `Choose Creator` / `Choose Studio`
- Creator badge：`Most Popular`
- Checkout trust：`Payments are processed by Creem after sign-in. AI Editor RSP does not store your payment details.`
- FAQ 增加 commercial-use 风险边界。

## Image Editor `/image-editor`

- Metadata title：`AI Image Editor — AI Editor RSP`
- H1：`Edit uploaded images with AI`
- 副标题：`Upload a photo, describe the change you want, and compare the before-and-after result before downloading.`
- 上传 CTA：`Upload image to start`
- 上传提示：`Drag and drop an image here, or browse files. PNG, JPG, or WebP under 5 MB.`
- 上传信任提示：`Uploaded images are processed to create your requested edit; review our Privacy Policy and AI Policy for details.`
- Edit area 标题：`Choose edit area`
- 未上传提示：`Upload an image first to choose an edit area.`
- 未登录 CTA：`Sign in to edit free`
- 可生成 CTA：`Generate edit ({credits} cr)`
- 生成中：`Editing image…`
- 下载按钮：`Download edited image`
- 未生成下载提示：`Generate an edit before downloading.`

## Header

- 未登录主 CTA：`Claim 3 free credits`
- 登录后保持：`Account`

## 验收标准

- 首页 5 秒内能看懂：AI image generator + ready-made prompts + free credits。
- Pricing 页面在套餐前解释 credits 规则。
- Image Editor 在上传前解释工作流与隐私/政策入口。
- Prompt Library 主动作是进入生成流程，而不是只复制。
- 不出现 `unlimited`、`guaranteed results`、fake testimonial、broad commercial license。
- `npm run build` 通过。
- 线上 `/`、`/pricing`、`/image-editor` 可访问并显示新文案。
