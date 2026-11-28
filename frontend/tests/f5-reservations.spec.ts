import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

// Run with the F5 FastAPI routes and a disposable local database on port 8000.
const futureDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short' })
  .format(new Date(Date.now() + 2 * 86_400_000))

const futureDateLabel = futureDate.split('-').reverse().join('/')

function dateChoice(dialog: Locator) {
  return dialog.getByRole('button', { name: /^Ngày đến/ })
}

function timeChoice(dialog: Locator) {
  return dialog.getByRole('button', { name: /^Giờ mong muốn/ })
}

async function selectFutureDate(dialog: Locator) {
  await dateChoice(dialog).click()
  const calendar = dialog.getByRole('region', { name: 'Lịch chọn ngày' })
  const day = calendar.getByRole('button', { name: futureDateLabel, exact: true })
  if (await day.count() === 0) await calendar.getByRole('button', { name: 'Tháng sau' }).click()
  await day.click()
}

async function selectPreferredTime(dialog: Locator) {
  await timeChoice(dialog).click()
  const picker = dialog.getByRole('region', { name: 'Chọn giờ mong muốn' })
  await picker.getByRole('button', { name: '19 giờ', exact: true }).click()
  await picker.getByRole('button', { name: '15 phút', exact: true }).click()
  await picker.getByRole('button', { name: 'Áp dụng giờ' }).click()
}

async function signIn(page: Page, email: string) {
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByRole('button', { name: 'Đăng nhập bản demo' }).click()
}

async function openGuestBooking(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Đặt chỗ', exact: true }).first().press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Đặt bàn', exact: true })
  await expect(dialog).toBeInViewport({ ratio: 0.95 })
  await selectFutureDate(dialog)
  await dialog.getByRole('button', { name: 'Tìm bàn', exact: true }).click()
  return dialog
}

async function selectSlotAndSignIn(page: Page, email: string) {
  const dialog = page.getByRole('dialog', { name: 'Đặt bàn', exact: true })
  await dialog.getByRole('group', { name: 'Chọn giờ đến' }).locator('button:enabled').first().click()
  await dialog.getByRole('button', { name: 'Đăng nhập để đặt bàn' }).click()
  await signIn(page, email)
  await dialog.getByLabel('Số điện thoại').fill('090 000 0000')
  return dialog
}

test.beforeEach(async ({ page }) => {
  await page.route('https://**/*', (route) => route.abort())
})

test('guest selects an API slot, then the customer creates, tracks and cancels their own reservation', async ({ page, request }) => {
  await openGuestBooking(page)
  const email = `f5-${randomUUID()}@example.test`
  const dialog = await selectSlotAndSignIn(page, email)
  const [created] = await Promise.all([
    page.waitForResponse((response) => response.url().endsWith('/api/reservations') && response.request().method() === 'POST'),
    dialog.getByRole('button', { name: 'Gửi yêu cầu đặt bàn' }).press('Enter'),
  ])
  expect(created.status()).toBe(201)
  const booking = await created.json()
  expect(booking.status).toBe('Pending confirmation')
  await expect(dialog.getByRole('status')).toContainText('Chờ xác nhận')
  await dialog.getByRole('button', { name: 'Xem yêu cầu trong Lịch của tôi' }).click()
  const workspace = page.getByRole('dialog', { name: 'Trung tâm DineVina' })
  await expect(workspace.getByRole('heading', { name: booking.venue_name })).toBeVisible()
  await expect(workspace.getByRole('button', { name: 'Hủy đặt bàn' })).toHaveCount(0)
  await expect(workspace.getByRole('region', { name: 'Lịch sử trạng thái' })).toContainText('Chờ xác nhận')
  await expect(workspace.getByText(/Nút hủy xuất hiện khi bàn đã được xác nhận/)).toBeVisible()
  await workspace.getByRole('button', { name: 'Về lịch đặt bàn' }).click()
  await expect(workspace.getByRole('button', { name: `Xem chi tiết ${booking.reservation_code}` })).toBeVisible()
  const cancelShortcut = workspace.getByRole('button', { name: `Hủy đặt bàn ${booking.reservation_code}` })
  await expect(cancelShortcut).toHaveCount(0)

  const partnerDecision = await request.post(`/api/partner/reservations/${booking.id}/confirm`, {
    headers: { 'X-User-Id': 'f5-browser-test-partner', 'X-User-Role': 'partner_staff', 'X-Partner-Venues': booking.venue_id },
  })
  expect(partnerDecision.ok()).toBeTruthy()
  await workspace.getByRole('button', { name: 'Cập nhật' }).click()
  await cancelShortcut.click()
  const reason = workspace.getByRole('textbox', { name: 'Lý do hủy (bắt buộc)' })
  await reason.fill('   ')
  await workspace.getByRole('button', { name: 'Xác nhận hủy' }).press('Enter')
  await expect(workspace.getByRole('alert')).toContainText('Vui lòng nhập lý do hủy.')

  await reason.fill('Thay đổi lịch thử nghiệm')
  await workspace.getByRole('button', { name: 'Xác nhận hủy' }).press('Enter')
  await expect(workspace.getByRole('status')).toContainText('Khách đã hủy')
  await expect(workspace.getByRole('region', { name: 'Lịch sử trạng thái' })).toContainText('Thay đổi lịch thử nghiệm')
  await workspace.getByRole('button', { name: 'Về lịch đặt bàn' }).click()
  await expect(workspace.getByRole('button', { name: `Xem chi tiết ${booking.reservation_code}` })).toBeVisible()

  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await signIn(page, email)
  await page.getByRole('button', { name: 'Lịch của tôi' }).click()
  await expect(workspace.getByRole('button', { name: `Xem chi tiết ${booking.reservation_code}` })).toBeVisible()

  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await signIn(page, `f5-${randomUUID()}@example.test`)
  await page.getByRole('button', { name: 'Lịch của tôi' }).click()
  await expect(workspace.getByText('Bạn chưa có yêu cầu đặt bàn.')).toBeVisible()
  expect((await request.get(`/api/reservations/${booking.id}`, {
    headers: { 'X-User-Id': 'f5-browser-test-other', 'X-User-Role': 'customer' },
  })).status()).toBe(403)
})

test('retry after a lost creation response reuses the key and the existing reservation', async ({ page, request }) => {
  await openGuestBooking(page)
  const dialog = await selectSlotAndSignIn(page, `f5-${randomUUID()}@example.test`)
  const keys: string[] = []
  await page.route('**/api/reservations', async (route) => {
    const intercepted = route.request()
    const data = intercepted.postDataJSON()
    keys.push(data.idempotency_key)
    if (keys.length === 1) {
      const response = await request.post('/api/reservations', {
        data,
        headers: {
          'X-User-Id': intercepted.headers()['x-user-id'],
          'X-User-Role': intercepted.headers()['x-user-role'],
        },
      })
      await route.abort('failed')
      expect(response.status()).toBe(201)
      return
    }
    await route.continue()
  })
  const submit = dialog.getByRole('button', { name: 'Gửi yêu cầu đặt bàn' })
  await submit.press('Enter')
  await expect(dialog.getByRole('alert')).toContainText('Chưa xác định được')
  await submit.press('Enter')
  await expect(dialog.getByRole('status')).toContainText('Chờ xác nhận')
  expect(keys).toHaveLength(2)
  expect(keys[1]).toBe(keys[0])
  await dialog.getByRole('button', { name: 'Xem yêu cầu trong Lịch của tôi' }).click()
  const workspace = page.getByRole('dialog', { name: 'Trung tâm DineVina' })
  await workspace.getByRole('button', { name: 'Về lịch đặt bàn' }).click()
  await expect(workspace.getByRole('button', { name: /Xem chi tiết DV-/ })).toHaveCount(1)
})

test('availability errors can be retried and conflicts show the API suggestions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('**/api/venues/*/availability?*', async (route) => {
    await route.fulfill({ status: 503, json: { detail: 'Temporary interruption' } })
  }, { times: 1 })
  const dialog = await openGuestBooking(page)
  await expect(dialog.getByRole('alert')).toContainText('Không tải được khung giờ.')
  await expect(dialog.getByRole('group', { name: 'Chọn giờ đến' })).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Thử lại' }).click()
  await selectSlotAndSignIn(page, `f5-${randomUUID()}@example.test`)
  await page.route('**/api/reservations', async (route) => {
    await route.fulfill({ status: 409, json: { detail: { code: 'SLOT_FULL', suggested_slots: ['19:30'] } } })
  })
  await dialog.getByRole('button', { name: 'Gửi yêu cầu đặt bàn' }).press('Enter')
  await expect(dialog.getByRole('alert')).toContainText('đã hết chỗ')
  await expect(dialog.getByRole('button', { name: '19:30', exact: true })).toHaveCount(1)
  await dialog.getByRole('group', { name: 'Giờ thay thế' }).getByRole('button', { name: '19:30', exact: true }).click()
  await expect(dialog.getByRole('group', { name: 'Thông tin đặt bàn lúc 19:30' })).toBeVisible()
  await expect(dialog.getByLabel('Số điện thoại')).toHaveValue('090 000 0000')
})

test('a confirmed reservation past the online cutoff shows the venue hotline', async ({ page, request }) => {
  const email = 'f5-cutoff@example.test'
  const customerId = 'cust-demo-01'
  const seeded = await request.get('/api/reservations/res-demo-001', {
    headers: { 'X-User-Id': customerId, 'X-User-Role': 'customer' },
  })
  expect(seeded.ok()).toBeTruthy()
  const booking = await seeded.json()
  await page.addInitScript(({ email, customerId }) => {
    localStorage.setItem('dinevina:demo-customer:' + email, customerId)
  }, { email, customerId })
  await page.clock.setFixedTime(new Date(Date.parse(booking.cancellation_deadline) + 1))
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await signIn(page, email)
  await page.getByRole('button', { name: 'Lịch của tôi' }).click()
  const workspace = page.getByRole('dialog', { name: 'Trung tâm DineVina' })
  await workspace.getByRole('button', { name: 'Xem chi tiết ' + booking.reservation_code }).click()
  await expect(workspace.getByText('Đã qua hạn hủy trực tuyến.', { exact: false })).toBeVisible()
  await expect(workspace.getByRole('link', { name: booking.venue_hotline })).toBeVisible()
  await expect(workspace.getByRole('button', { name: 'Hủy đặt bàn' })).toHaveCount(0)
})

test('booking search keeps the date, party size and preferred time when an SME has no matching slots', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.getByLabel('Giờ mong muốn', { exact: true }).fill('19:15')
  await page.getByRole('button', { name: 'Tìm bàn', exact: true }).click()
  const restaurants = page.getByRole('region', { name: 'Nhà hàng nổi bật tại Sài Gòn' })
  await expect(restaurants.getByText('Chọn một quán để kiểm tra giờ còn chỗ.')).toBeVisible()
  await restaurants.getByRole('button', { name: 'Đặt chỗ', exact: true }).first().click()
  const dialog = page.getByRole('dialog', { name: 'Đặt bàn', exact: true })
  const originalVenue = await dialog.getByRole('heading', { level: 2 }).innerText()
  await expect(dialog.getByRole('combobox')).toHaveCount(0)
  await expect(timeChoice(dialog)).toContainText('19:15')
  await selectFutureDate(dialog)
  await dialog.getByRole('button', { name: 'Tăng số khách' }).click()
  await dialog.getByRole('button', { name: 'Tăng số khách' }).click()
  await expect(dialog.getByLabel('Số khách', { exact: true })).toHaveValue('4')

  await page.route('**/api/venues/*/availability?*', (route) => route.fulfill({
    json: { slots: [{ time: '19:00', status: 'Sold out', remaining_capacity: 0, is_blocked: false }] },
  }), { times: 1 })
  await dialog.getByRole('button', { name: 'Tìm bàn' }).click()
  await expect(dialog.getByRole('status')).toContainText('Quán chưa có khung giờ phù hợp cho 4 khách')
  await expect(dialog.getByRole('button', { name: /19:00/ })).toBeDisabled()
  await dialog.getByRole('button', { name: 'Xem quán khác' }).click()

  const otherVenues = page.getByRole('region', { name: 'Tìm quán khác' })
  await expect(otherVenues.getByRole('heading', { name: originalVenue, exact: true })).toHaveCount(0)
  await otherVenues.getByRole('button', { name: 'Đặt chỗ', exact: true }).first().click()
  await expect(dateChoice(dialog)).toContainText(futureDateLabel)
  await expect(dialog.getByLabel('Số khách', { exact: true })).toHaveValue('4')
  await expect(timeChoice(dialog)).toContainText('19:15')
})

test('the nearest available time appears first and can be changed before signing in', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Đặt chỗ', exact: true }).first().click()
  const dialog = page.getByRole('dialog', { name: 'Đặt bàn', exact: true })
  await selectFutureDate(dialog)
  await selectPreferredTime(dialog)
  await page.route('**/api/venues/*/availability?*', (route) => route.fulfill({
    json: { slots: [
      { time: '18:00', status: 'Available', remaining_capacity: 8, is_blocked: false },
      { time: '19:15', status: 'Available', remaining_capacity: 8, is_blocked: true },
      { time: '19:30', status: 'Available', remaining_capacity: 5, is_blocked: false },
    ] },
  }), { times: 1 })
  await dialog.getByRole('button', { name: 'Tìm bàn' }).click()
  await expect(dialog.getByRole('status')).toContainText('Khung 19:15 không khả dụng')
  const choices = dialog.getByRole('group', { name: 'Chọn giờ đến' })
  await expect(choices.getByRole('button').first()).toHaveText('19:30')
  await expect(choices.getByRole('button', { name: /19:15/ })).toContainText('Không khả dụng')
  await choices.getByRole('button').first().click()
  await expect(dialog.getByRole('heading', { name: 'Kiểm tra thông tin trước khi gửi' })).toBeVisible()
  await expect(dialog.getByText('19:30', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Chọn khung giờ khác' }).click()
  await expect(choices.getByRole('button', { name: /19:15/ })).toBeDisabled()
})

test('the time picker excludes hours and minutes outside the selected venue’s opening schedule', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const card = page.getByRole('article').filter({ has: page.getByRole('heading', { name: /Hoàng Gia Lẩu/ }) })
  await card.getByRole('button', { name: 'Đặt chỗ', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Đặt bàn', exact: true })
  await timeChoice(dialog).click()
  const picker = dialog.getByRole('region', { name: 'Chọn giờ mong muốn' })
  const hourGroup = picker.getByRole('group', { name: 'Giờ', exact: true })
  const minuteGroup = picker.getByRole('group', { name: 'Phút', exact: true })
  await expect(hourGroup.getByRole('button').first()).toHaveText('10:30')
  await expect(hourGroup.getByRole('button').last()).toHaveText('22:00')
  await expect(hourGroup.getByRole('button', { name: '09 giờ' })).toHaveCount(0)
  await expect(hourGroup.getByRole('button', { name: '23 giờ' })).toHaveCount(0)
  await hourGroup.getByRole('button', { name: '10 giờ 30 phút' }).click()
  await expect(minuteGroup.getByRole('button')).toHaveText(['00:30', '00:45'])
  await picker.getByRole('button', { name: 'Áp dụng giờ' }).click()
  await expect(timeChoice(dialog)).toContainText('10:30')
})

test('the branch demo preserves booking criteria and uses only frontend availability', async ({ page }) => {
  const bookingRequests: string[] = []
  page.on('request', (request) => {
    const path = new URL(request.url()).pathname
    if (/^\/api\/(?:reservations(?:\/|$)|venues\/[^/]+\/(?:availability|branches)$)/.test(path)) {
      bookingRequests.push(path)
    }
  })
  await page.goto('/?demo=branches', { waitUntil: 'domcontentloaded' })

  const chooser = page.getByRole('dialog', { name: 'Chọn địa điểm đặt bàn' })
  await expect(chooser.getByText('Dữ liệu mô phỏng để thử luồng chọn chi nhánh.')).toBeVisible()
  await chooser.getByRole('button', { name: /Quận 1/ }).click()

  const booking = page.getByRole('dialog', { name: 'Đặt bàn', exact: true })
  await selectFutureDate(booking)
  await selectPreferredTime(booking)
  await booking.getByLabel('Số khách', { exact: true }).fill('4')
  await booking.getByRole('button', { name: 'Tìm bàn', exact: true }).click()
  const choices = booking.getByRole('group', { name: 'Chọn giờ đến' })
  await expect(choices.getByRole('button', { name: /19:00/ })).toBeDisabled()
  await booking.getByRole('button', { name: 'Đổi chi nhánh' }).click()
  await chooser.getByRole('button', { name: /Quận 3/ }).click()

  await expect(booking.getByRole('heading', { name: /Quận 3/ })).toBeVisible()
  await expect(dateChoice(booking)).toContainText(futureDateLabel)
  await expect(timeChoice(booking)).toContainText('19:15')
  await expect(booking.getByLabel('Số khách', { exact: true })).toHaveValue('4')
  await booking.getByRole('button', { name: 'Tìm bàn', exact: true }).click()
  await choices.getByRole('button', { name: '19:00', exact: true }).click()
  await expect(booking.getByText('Đây là bản mô phỏng. Thông tin trên chỉ dùng để xem trước.')).toBeVisible()
  await expect(booking.getByRole('button', { name: 'Gửi yêu cầu đặt bàn' })).toHaveCount(0)
  await booking.getByRole('button', { name: 'Kết thúc mô phỏng' }).click()
  await expect(booking).toBeHidden()
  expect(bookingRequests).toEqual([])
})

test('the default demo account cancels a confirmed sample in the browser', async ({ page }) => {
  const detailRequests: string[] = []
  page.on('request', (request) => {
    const path = new URL(request.url()).pathname
    if (path.startsWith('/api/reservations/') || (path === '/api/reservations' && request.method() !== 'GET')) {
      detailRequests.push(path)
    }
  })
  await page.route('**/api/reservations?*', (route) =>
    route.fulfill({ json: { items: [], total: 0, page: 1, page_size: 10 } }),
  )
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await page.getByRole('button', { name: 'Đăng nhập bản demo' }).click()
  await page.getByRole('button', { name: 'Lịch của tôi' }).click()
  const workspace = page.getByRole('dialog', { name: 'Trung tâm DineVina' })

  await expect(workspace.getByText('Đã xác nhận', { exact: true })).toBeVisible()
  await workspace.getByRole('button', { name: 'Hủy đặt bàn DV-MAU01' }).click()
  await workspace.getByRole('textbox', { name: 'Lý do hủy (bắt buộc)' }).fill('Đổi lịch')
  await workspace.getByRole('button', { name: 'Xác nhận hủy' }).click()
  await expect(workspace.getByRole('status')).toContainText('Khách đã hủy')
  await expect(workspace.getByRole('region', { name: 'Lịch sử trạng thái' })).toContainText('Đổi lịch')
  await workspace.getByRole('button', { name: 'Về lịch đặt bàn' }).click()
  await expect(workspace.getByText('Khách đã hủy', { exact: true })).toBeVisible()
  await expect(workspace.getByRole('button', { name: 'Hủy đặt bàn DV-MAU01' })).toHaveCount(0)
  expect(detailRequests).toEqual([])
})
