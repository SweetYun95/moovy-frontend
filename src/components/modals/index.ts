// 모달 컴포넌트들 export
export { default as Modal } from './Modal/Modal';
export { default as SettingsModal } from './SettingsModal/SettingsModal';
export { default as DeleteModal } from './DeleteModal/DeleteModal';
export { default as ConfirmModal } from './ConfirmModal/ConfirmModal';
export { default as InquiryModal } from './InquiryModal/InquiryModal';
export { default as ReportModal } from './ReportModal/ReportModal';
export { default as CommentEditModal } from './CommentEditModal/CommentEditModal';
export { default as ProfileEditModal } from './ProfileEditModal/ProfileEditModal';
export { default as TopicManagementModal } from './TopicManagementModal/TopicManagementModal';

// 타입들도 export
export type { ModalProps } from './Modal/Modal';
export type { SettingsData, SettingsModalProps } from './SettingsModal/SettingsModal';
export type { DeleteModalProps } from './DeleteModal/DeleteModal';
export type { ConfirmModalProps } from './ConfirmModal/ConfirmModal';
export type { InquiryModalProps } from './InquiryModal/InquiryModal';
export type { ReportModalProps } from './ReportModal/ReportModal';
export type { CommentEditModalProps } from './CommentEditModal/CommentEditModal';
export type { ProfileEditModalProps } from './ProfileEditModal/ProfileEditModal';
export type { TopicData, TopicManagementModalProps } from './TopicManagementModal/TopicManagementModal';

// Modal Component wrappers
export { DeleteModalComponent } from './DeleteModal/DeleteModal';
export { ConfirmModalComponent } from './ConfirmModal/ConfirmModal';
export { InquiryModalComponent } from './InquiryModal/InquiryModal';
export { ReportModalComponent } from './ReportModal/ReportModal';
export { CommentEditModalComponent } from './CommentEditModal/CommentEditModal';
export { ProfileEditModalComponent } from './ProfileEditModal/ProfileEditModal';
export { SettingsModalComponent } from './SettingsModal/SettingsModal';
export { TopicManagementModalComponent } from './TopicManagementModal/TopicManagementModal';
export { default as SanctionHistoryModal } from './SanctionHistoryModal/SanctionHistoryModal';
export type { SanctionHistory, SanctionHistoryModalProps } from './SanctionHistoryModal/SanctionHistoryModal';
export { default as WithdrawalConfirmModal } from './WithdrawalConfirmModal/WithdrawalConfirmModal';
export type { WithdrawalConfirmModalProps } from './WithdrawalConfirmModal/WithdrawalConfirmModal';
