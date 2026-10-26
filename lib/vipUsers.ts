export interface VipUser {
  id: string;
  passcode: string;
  name: string;
}

export const VIP_USERS: VipUser[] = [
  { id: 'vantin', passcode: '191008', name: 'Đinh Văn Tín (Admin)' },
  { id: 'vip01', passcode: '849201', name: 'Khách VIP 1' },
  { id: 'vip02', passcode: '392014', name: 'Khách VIP 2' },
  { id: 'vip03', passcode: '710482', name: 'Khách VIP 3' },
  { id: 'vip04', passcode: '582910', name: 'Khách VIP 4' },
  { id: 'vip05', passcode: '491028', name: 'Khách VIP 5' },
  { id: 'vip06', passcode: '620194', name: 'Khách VIP 6' },
  { id: 'vip07', passcode: '104829', name: 'Khách VIP 7' },
  { id: 'vip08', passcode: '930182', name: 'Khách VIP 8' },
  { id: 'vip09', passcode: '274910', name: 'Khách VIP 9' },
];