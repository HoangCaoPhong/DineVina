import { expect, test } from '@playwright/test'

test.describe('F7 Availability & Partner Dashboard', () => {
  test('partner can open dashboard and availability workspace backed by API', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'Đăng nhập' }).click()
    await page.getByLabel('Trải nghiệm với vai trò').selectOption('partner')
    await page.getByRole('button', { name: 'Đăng nhập bản demo' }).click()

    await page.getByRole('button', { name: 'Lịch của tôi' }).click()
    await expect(page.getByRole('heading', { name: 'Điều phối vận hành nhà hàng' })).toBeVisible()
    await expect(page.getByText('Chờ xác nhận', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Yêu cầu đặt bàn' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Yêu cầu đặt tiệc' })).toBeVisible()
    await expect(page.getByText(/DVF7|DVF70001/).first()).toBeVisible()

    await page.getByRole('button', { name: 'Giờ & sức chứa' }).click()
    await expect(page.getByRole('heading', { name: 'Giờ mở cửa & sức chứa' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Khung giờ khóa' })).toBeVisible()
    await expect(page.locator('.f7-capacity input')).toHaveValue(/\d+/)
    await expect(page.getByText('Thứ 2')).toBeVisible()
    await expect(page.getByText('Chủ nhật')).toBeVisible()
  })

  test('public availability API returns persistent slot configuration', async ({ request }) => {
    const response = await request.get(
      'http://127.0.0.1:8000/api/venues/v-hcmc-001/availability?date=2027-01-05&party_size=2',
    )
    expect(response.ok()).toBeTruthy()
    const body = await response.json()
    expect(body.venue_id).toBe('v-hcmc-001')
    expect(body.slot_granularity_minutes).toBe(30)
    expect(body.slots.length).toBeGreaterThan(0)
    expect(body.slots[0]).toHaveProperty('remaining_capacity')
    expect(body.slots[0]).toHaveProperty('is_blocked')
  })
})
