
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface Applicant {
  name: string;
  email: string;
  request: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface Member {
  name: string;
  email: string;
  group: string;
}

interface Statistics {
  requestStats: { [key: string]: number };
  approvalStats: { approvedRate: string; rejectedRate: string };
  membersByGroup: { [key: string]: number };
}

const ReportPage: React.FC = () => {
  // State to store the statistics data
  const [statistics, setStatistics] = useState<Statistics>({
    requestStats: {},
    approvalStats: { approvedRate: '0', rejectedRate: '0' },
    membersByGroup: {},
  });

  // Simulated data for applicants and members
  const applicants: Applicant[] = [
    { name: 'Nguyễn Văn A', email: 'a@example.com', request: 'Design', status: 'Pending' },
    { name: 'Trần Thị B', email: 'b@example.com', request: 'Dev', status: 'Approved' },
    { name: 'Lê Minh C', email: 'c@example.com', request: 'Media', status: 'Rejected' },
    { name: 'Phạm Quang D', email: 'd@example.com', request: 'Dev', status: 'Pending' },
    { name: 'Nguyễn Thị E', email: 'e@example.com', request: 'Design', status: 'Approved' },
  ];

  const members: Member[] = [
    { name: 'Trần Thị B', email: 'b@example.com', group: 'Team Dev' },
    { name: 'Nguyễn Thị E', email: 'e@example.com', group: 'Team Design' },
    { name: 'Lê Minh C', email: 'c@example.com', group: 'Team Media' },
  ];

  // Calculate statistics when the page loads
  useEffect(() => {
    const getStatistics = () => {
      const requestStats: { [key: string]: number } = applicants.reduce((acc, item) => {
        acc[item.request] = (acc[item.request] || 0) + 1;
        return acc;
      }, {});

      const approved = applicants.filter(item => item.status === 'Approved').length;
      const rejected = applicants.filter(item => item.status === 'Rejected').length;
      const total = applicants.length;
      const approvalStats = {
        approvedRate: ((approved / total) * 100).toFixed(2),
        rejectedRate: ((rejected / total) * 100).toFixed(2),
      };

      const membersByGroup: { [key: string]: number } = members.reduce((acc, member) => {
        acc[member.group] = (acc[member.group] || 0) + 1;
        return acc;
      }, {});

      setStatistics({
        requestStats,
        approvalStats,
        membersByGroup,
      });
    };

    getStatistics();
  }, []);

  // Export the report to an Excel file
  const exportReport = () => {
    const data = [
      { 'Nguyện vọng': 'Design', 'Số lượng': statistics.requestStats['Design'] || 0 },
      { 'Nguyện vọng': 'Dev', 'Số lượng': statistics.requestStats['Dev'] || 0 },
      { 'Nguyện vọng': 'Media', 'Số lượng': statistics.requestStats['Media'] || 0 },
      { 'Tỷ lệ duyệt': statistics.approvalStats.approvedRate },
      { 'Tỷ lệ từ chối': statistics.approvalStats.rejectedRate },
      { 'Team Dev': statistics.membersByGroup['Team Dev'] || 0 },
      { 'Team Design': statistics.membersByGroup['Team Design'] || 0 },
      { 'Team Media': statistics.membersByGroup['Team Media'] || 0 },
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo');
    XLSX.writeFile(wb, 'report.xlsx');
  };

  return (
    <div className="report-page">
      <h2>Báo Cáo và Thống Kê</h2>

      <h3>Số lượng đơn theo nguyện vọng</h3>
      <ul>
        {Object.entries(statistics.requestStats).map(([request, count]) => (
          <li key={request}>{request}: {count} đơn</li>
        ))}
      </ul>

      <h3>Tỷ lệ duyệt và từ chối</h3>
      <p>Tỷ lệ duyệt: {statistics.approvalStats.approvedRate}%</p>
      <p>Tỷ lệ từ chối: {statistics.approvalStats.rejectedRate}%</p>

      <h3>Số lượng thành viên theo nhóm</h3>
      <ul>
        {Object.entries(statistics.membersByGroup).map(([group, count]) => (
          <li key={group}>{group}: {count} thành viên</li>
        ))}
      </ul>

      <button onClick={exportReport}>Xuất Báo Cáo</button>
    </div>
  );
};

export default ReportPage;
