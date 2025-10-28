import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.scss';
import './TestApp.scss';
import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header/Header';
import { ContentCardComponent } from './components/movies/ContentCard/ContentCard';
import { MovieCardComponent } from './components/Home/MovieCard/MovieCard';
import { ImageCommentCardComponent } from './components/Home/ImageCommentCard/ImageCommentCard';
import { SimpleCommentCardComponent } from './components/movies/CommentCard/CommentCard';
import {
  DeleteModalComponent,
  InquiryModalComponent,
  ReportModalComponent,
  CommentEditModalComponent,
  ProfileEditModalComponent,
  SettingsModalComponent,
  TopicManagementModalComponent,
} from './components/modals';
import { AdminProfileEditModalComponent } from './components/modals/ProfileEditModal/ProfileEditModal';
import InquiryModal from './components/modals/InquiryModal/InquiryModal';
import ReportModal from './components/modals/ReportModal/ReportModal';
import { SanctionHistoryModal, WithdrawalConfirmModal } from './components/modals';
import ConfirmModal from './components/modals/ConfirmModal/ConfirmModal';
import { forceWithdrawUser } from './services/api/userApi';
import { Button } from './components/common/Button/ButtonStyle';
import { LoginButton, StatusButton, ActionButton, WideButton } from './components/common/Button/Button';
import { DatePicker } from './components/common/DatePicker/DatePicker';
import { DateSelector } from './components/common/DateSelector/DateSelector';
import { ImageUpload } from './components/common/ImageUpload/ImageUpload';
import { QuickMenu } from './components/Home/QuickMenu/QuickMenu';
import Spinner from './components/common/Spinner';
import { MypageTabs, AdminTabs } from './components/common/Tabs/index';
import { EmailInput, PasswordInput, NameInput, NicknameInput, SuccessInput, WarningInput, ErrorInput } from './components/common/Input';
import { GenreSelector, RatingSelector, YearSelector, CountrySelector } from './components/common/Selector';
import { ReviewTextarea, CommentTextarea, ErrorTextarea, InquiryTextarea, ProfileTextarea } from './components/common/Textarea';
import { IdSaveCheckbox, PrivacyCheckbox, TermsCheckbox, MarketingCheckbox, SuccessCheckbox, ErrorCheckbox } from './components/common/Checkbox';
import { StandardPagination, ExtendedPagination, SmallPagination, LargePagination } from './components/common/Pagination';
import { UserManagementFilter, WorkManagementFilter, CommentManagementFilter, ReportManagementFilter } from './components/admin/AdminFilter';

function DatePickerExamples() {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <div className="component-demo">
      <h4>Date Picker Components</h4>
      <div className="row">
        <div className="col-md-6">
          <DatePicker
            placeholder="날짜를 선택하세요"
            value={selectedDate}
            onChange={setSelectedDate}
          />
        </div>
        <div className="col-md-6">
          <DatePicker
            placeholder="날짜를 선택하세요"
            value={selectedDate}
            onChange={setSelectedDate}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
}

function DateSelectorExamples() {
  return (
    <div className="component-demo">
      <h4>Date Selector Components</h4>
      <div className="row">
        <div className="col-md-6">
          <DateSelector type="year-only" theme="dark" />
        </div>
        <div className="col-md-6">
          <DateSelector type="year-only" theme="light" />
        </div>
      </div>
    </div>
  );
}

function ImageUploadExamples() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  return (
    <div className="component-demo">
      <h4>Image Upload Components</h4>
      <ImageUpload
        images={uploadedImages}
        onChange={setUploadedImages}
        maxImages={5}
      />
    </div>
  );
}

function CheckboxExamples() {
  return (
    <div className="component-demo">
      <h4>Checkbox Components</h4>
      <div className="row">
        <div className="col-md-6">
          <IdSaveCheckbox />
          <PrivacyCheckbox />
          <TermsCheckbox />
          <MarketingCheckbox />
        </div>
        <div className="col-md-6">
          <SuccessCheckbox />
          <ErrorCheckbox />
        </div>
      </div>
    </div>
  );
}

function ButtonExamples() {
  return (
    <div className="component-demo">
      <h4>Button Components</h4>
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <LoginButton loginType="local" />
            <LoginButton loginType="google" />
            <LoginButton loginType="kakao" />
          </div>
          <div className="mb-3">
            <ActionButton action="edit" />
            <ActionButton action="delete" />
            <ActionButton action="cancel" />
          </div>
          <div className="mb-3">
            <StatusButton status="danger" />
            <StatusButton status="success" />
            <StatusButton status="info" />
          </div>
          <div className="mb-3">
            <WideButton buttonType="delete" />
            <WideButton buttonType="comment" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TabsExamples() {
  return (
    <div className="component-demo">
      <h4>Tabs Components</h4>
      <div className="row">
        <div className="col-md-12">
          <div className="mb-4">
            <h5>마이페이지 메뉴 (언더라인 5개)</h5>
            <MypageTabs />
          </div>
          <div className="mb-4">
            <h5>관리자 메뉴 (언더라인 2개 + 버튼 하위탭)</h5>
            <AdminTabs />
          </div>
        </div>
      </div>
    </div>
  );
}

function TextareaExamples() {
  return (
    <div className="component-demo">
      <h4>Textarea Components</h4>
      <div className="row">
        <div className="col-md-12">
          <div className='mb-3'>
            <label htmlFor="review-textarea">리뷰 작성</label>
            <ReviewTextarea />
          </div>
          <div className='mb-3'>
            <label htmlFor="comment-textarea">댓글 작성</label>
            <CommentTextarea />
          </div>
          <div className='mb-3'>
            <label htmlFor="textarea-error">Error State</label>
            <ErrorTextarea />
            <small className="text-danger">필수 입력 항목입니다.</small>
          </div>
          <div className='mb-3'>
            <label htmlFor="inquiry-textarea">문의 작성</label>
            <InquiryTextarea />
          </div>
          <div className='mb-3'>
            <label htmlFor="profile-textarea">프로필 소개</label>
            <ProfileTextarea />
          </div>
        </div>
      </div>
    </div>
  );
}

function InputExamples() {
  return (
    <div className="component-demo">
      <h4>Input Components</h4>
      <div className="row">
        <div className="col-md-6">
          <div className='mb-3'>
            <label htmlFor="email">Email</label>
            <EmailInput />
          </div>
          <div className='mb-3'>
            <label htmlFor="name">이름</label>
            <NameInput />
          </div>
          <div className='mb-3'>
            <label htmlFor="nickname">닉네임</label>
            <NicknameInput />
          </div>
        </div>
        <div className="col-md-6">
          <div className='mb-3'>
            <label htmlFor="password">Password</label>
            <PasswordInput />
          </div>
          <div className='mb-3'>
            <label htmlFor="success-input">Success State</label>
            <SuccessInput />
            <small className="text-success">Success!</small>
          </div>
          <div className='mb-3'>
            <label htmlFor="warning-input">Warning State</label>
            <WarningInput />
            <small className="text-warning">Warning!</small>
          </div>
          <div className='mb-3'>
            <label htmlFor="error-input">Error State</label>
            <ErrorInput />
            <small className="text-danger">Error!</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaginationExamples() {
  return (
    <div className="component-demo">
      <h4>Pagination Components</h4>
      <div className="row">
        <div className="col-md-12">
          <div className="mb-4">
            <label className="d-block mb-2">기본 페이지네이션 (10페이지)</label>
            <StandardPagination />
          </div>
          <div className="mb-4">
            <label className="d-block mb-2">큰 페이지네이션 (50페이지)</label>
            <ExtendedPagination />
          </div>
          <div className="mb-4">
            <label className="d-block mb-2">작은 페이지네이션 (5페이지)</label>
            <SmallPagination />
          </div>
          <div className="mb-4">
            <label className="d-block mb-2">대규모 페이지네이션 (100페이지)</label>
            <LargePagination />
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectorExamples() {
  return (
    <div className="component-demo">
      <h4>Selector Components</h4>
      <div className="row">
        <div className="col-md-6">
          <div className='mb-3'>
            <label htmlFor="genre-selector">장르 선택</label>
            <GenreSelector />
          </div>
          <div className='mb-3'>
            <label htmlFor="year-selector">연도 선택</label>
            <YearSelector />
          </div>
        </div>
        <div className="col-md-6">
          <div className='mb-3'>
            <label htmlFor="rating-selector">평점 선택</label>
            <RatingSelector />
          </div>
          <div className='mb-3'>
            <label htmlFor="country-selector">국가 선택</label>
            <CountrySelector />
          </div>
        </div>
      </div>
    </div>
  );
}

function TestApp() {
  // 모달 상태 관리
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showInquiryAdminModal, setShowInquiryAdminModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReportAdminModal, setShowReportAdminModal] = useState(false);
  const [showSanctionHistoryModal, setShowSanctionHistoryModal] = useState(false);
  const [sanctionHistories, setSanctionHistories] = useState<Array<{ id: number; reason: string }>>([]);
  const [showWithdrawalUserModal, setShowWithdrawalUserModal] = useState(false);
  const [showWithdrawalAdminModal, setShowWithdrawalAdminModal] = useState(false);
  const [withdrawalUserId, setWithdrawalUserId] = useState<number | null>(null);
  const [showCommentEditModal, setShowCommentEditModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showAdminProfileEditModal, setShowAdminProfileEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);

  return (
    <>
      <Header
        onSearchChange={(value) => console.log('검색:', value)}
        onSearch={(value) => alert(`검색: ${value}`)}
        onLoginClick={() => alert('로그인 클릭!')}
        onSignupClick={() => alert('회원가입 클릭!')}
      />
      
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="p-4">
              <h1 className="text-primary mb-4">Moovy Component Library</h1>
              
              {/* Quick Menu */}
              <h4>QuickMenu Component</h4>
              <QuickMenu />

              {/* Spinner */}
              <div className="component-demo">
                <h4>Spinner Component</h4>
                <Spinner />
              </div>

              {/* Input */}
              <InputExamples />

              {/* Selector */}
              <SelectorExamples />

              {/* Textarea */}
              <TextareaExamples />

              {/* Image Upload */}
              <ImageUploadExamples />

              {/* Date Selector */}
              <DateSelectorExamples />

              {/* Date Picker */}
              <DatePickerExamples />

              {/* Button */}
              <ButtonExamples />

              {/* Checkbox */}
              <CheckboxExamples />

              {/* Pagination */}
              <PaginationExamples />

              {/* Tabs */}
              <TabsExamples />

              {/* Content Card */}
              <ContentCardComponent />
              
              {/* Movie Card */}
              <MovieCardComponent />

              {/* Image Comment Card */}
              <ImageCommentCardComponent />

              {/* Comment Card */}
              <SimpleCommentCardComponent />

              {/* Admin Filters */}
              <div className="component-demo">
                <h4>Admin Filter Components</h4>
                <div className="row g-4">
                  <div className="col-12">
                    <UserManagementFilter 
                      onSearch={(filters) => console.log('유저 필터:', filters)}
                    />
                  </div>
                  <div className="col-12">
                    <WorkManagementFilter 
                      onSearch={(filters) => console.log('작품 필터:', filters)}
                    />
                  </div>
                  <div className="col-12">
                    <CommentManagementFilter 
                      onSearch={(filters) => console.log('댓글 필터:', filters)}
                    />
                  </div>
                  <div className="col-12">
                    <ReportManagementFilter 
                      onSearch={(filters) => console.log('신고 필터:', filters)}
                    />
                  </div>
                </div>
              </div>

              {/* Modals */}
              <div className="component-demo">
                <h4>Modal Components</h4>
                <div className="row">
                  <div className="col-md-6">
                    <h4>코멘트삭제, 환경설정모달</h4>
                    <div className="mt-2">
                      <Button variant="primary" size='md' onClick={() => setShowDeleteModal(true)} className="mr-2 mb-2">
                        코멘트삭제
                      </Button>
                      <Button variant="primary" size='md' onClick={() => setShowSettingsModal(true)} className="mr-2 mb-2">
                        환경설정
                      </Button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h4>탈퇴모달(유저, 관리자)</h4>
                    <div className="mt-2">
                      <Button variant="primary" size='md' onClick={() => setShowWithdrawalUserModal(true)} className="mr-2 mb-2">
                        유저
                      </Button>
                      <Button variant="primary" size='md' onClick={() => setShowWithdrawalAdminModal(true)} className="mr-2 mb-2">
                        관리자
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <h4>1:1 문의모달(유저, 관리자)</h4>
                    <div className="mt-2">
                      <Button variant="primary" size='md' onClick={() => setShowInquiryModal(true)} className="mr-2 mb-2">
                        유저
                      </Button>
                      <Button variant="primary" size='md' onClick={() => setShowInquiryAdminModal(true)} className="mr-2 mb-2">
                        관리자
                      </Button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h4>신고모달(유저, 관리자)</h4>
                    <div className="mt-2">
                      <Button variant="primary" size='md' onClick={() => setShowReportModal(true)} className="mr-2 mb-2">
                        유저
                      </Button>
                      <Button variant="primary" size='md' onClick={() => setShowReportAdminModal(true)} className="mr-2 mb-2">
                        관리자
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <h4>코멘트작성모달</h4>
                    <div className="mt-2">
                      <Button variant="primary" size='md' onClick={() => setShowCommentEditModal(true)} className="mr-2 mb-2">
                        코멘트작성
                      </Button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h4>프로필편집, 유저관리(관리자)모달</h4>
                    <div className="mt-2">
                      <Button variant="primary" size='md' onClick={() => setShowProfileEditModal(true)} className="mr-2 mb-2">
                        프로필편집
                      </Button>
                      <Button variant="primary" size='md' onClick={() => setShowAdminProfileEditModal(true)} className="mr-2 mb-2">
                        유저관리
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <h4>토픽관리모달</h4>
                    <div className="mt-2">
                      <Button variant="primary" size='md' onClick={() => setShowTopicModal(true)} className="mr-2 mb-2">
                        토픽생성
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Components */}
              <DeleteModalComponent isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
              <InquiryModalComponent isOpen={showInquiryModal} onClose={() => setShowInquiryModal(false)} />
              <InquiryModal
                isOpen={showInquiryAdminModal}
                onClose={() => setShowInquiryAdminModal(false)}
                mode="admin"
                inquiryData={{
                  category: 'general',
                  content: '어쩌구 저쩌구 문의 사항입니다.',
                  initialReply: '답변내용을 적어주세요.'
                }}
                onSubmit={(data) => {
                  console.log('답변 저장:', data);
                  setShowInquiryAdminModal(false);
                }}
                onReport={() => {
                  console.log('신고 처리');
                }}
              />
              <ReportModalComponent 
                isOpen={showReportModal} 
                onClose={() => setShowReportModal(false)}
                targetType="user"
                targetId={1}
                targetUser={{ name: '홍길동', reportCount: 5 }}
                onReportCountClick={(data) => {
                  setSanctionHistories(data);
                  setShowSanctionHistoryModal(true);
                }}
              />
              <ReportModal 
                isOpen={showReportAdminModal}
                onClose={() => setShowReportAdminModal(false)}
                mode="admin"
                reportData={{
                  category: 'spam',
                  content: '스팸 신고 내용입니다.',
                  targetUser: {
                    name: 'Natali Craig',
                    reportCount: 5,
                    avatar: 'https://picsum.photos/48/48?random=1'
                  }
                }}
                onSubmit={(data) => {
                  console.log('신고 처리:', data);
                  setShowReportAdminModal(false);
                }}
                onReportCountClick={(data) => {
                  setSanctionHistories(data);
                  setShowSanctionHistoryModal(true);
                }}
              />
              <SanctionHistoryModal
                isOpen={showSanctionHistoryModal}
                onClose={() => setShowSanctionHistoryModal(false)}
                histories={sanctionHistories}
                onDetailClick={(id) => console.log('상세 신고내역:', id)}
              />
              <CommentEditModalComponent isOpen={showCommentEditModal} onClose={() => setShowCommentEditModal(false)} />
              <ProfileEditModalComponent 
                isOpen={showProfileEditModal} 
                onClose={() => setShowProfileEditModal(false)}
                onSuccess={() => setShowConfirmModal(true)}
              />
              <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                message="수정되었습니다."
              />
              <AdminProfileEditModalComponent 
                isOpen={showAdminProfileEditModal} 
                onClose={() => setShowAdminProfileEditModal(false)}
                userId={1}
                onWithdrawClick={() => {
                  setWithdrawalUserId(1);
                  setShowAdminProfileEditModal(false);
                  setShowWithdrawalAdminModal(true);
                }}
                onSanctionData={(data) => {
                  setSanctionHistories(data);
                  setShowSanctionHistoryModal(true);
                }}
              />
              <SettingsModalComponent isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
              <TopicManagementModalComponent isOpen={showTopicModal} onClose={() => setShowTopicModal(false)} />
              <WithdrawalConfirmModal
                isOpen={showWithdrawalUserModal}
                onClose={() => setShowWithdrawalUserModal(false)}
                mode="user"
                userName="홍길동"
                onConfirm={() => {
                  console.log('유저 탈퇴');
                  setShowWithdrawalUserModal(false);
                }}
              />
              <WithdrawalConfirmModal
                isOpen={showWithdrawalAdminModal}
                onClose={() => setShowWithdrawalAdminModal(false)}
                mode="admin"
                userName="홍길동"
                reportCount={3}
                onConfirm={async () => {
                  if (withdrawalUserId !== null) {
                    try {
                      await forceWithdrawUser(withdrawalUserId, '관리자에 의한 강제 탈퇴');
                      console.log('관리자 강제 탈퇴 완료');
                      setShowWithdrawalAdminModal(false);
                      setWithdrawalUserId(null);
                    } catch (error) {
                      console.error('강제 탈퇴 실패:', error);
                      // TODO: 에러 토스트 메시지 표시
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TestApp;
