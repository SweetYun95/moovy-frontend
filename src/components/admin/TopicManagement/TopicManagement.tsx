import React, { useState, useEffect, useCallback } from 'react';
import { Tabs } from '../../common/Tabs/Tabs';
import { StandardPagination } from '../../common/Pagination';
import { CommentManagementFilter } from '../AdminFilter';
import { Button } from '../../common/Button/ButtonStyle';
import { ActionButton } from '../../common/Button/Button';
import { TopicManagementModalComponent } from '../../modals/TopicManagementModal/TopicManagementModal';
import { getAdminTopics } from '../../../services/api/topicApi';
import './TopicManagement.scss';
import Avatar from '../../../assets/Avatar.png';
import { Icon } from '@iconify/react';

interface Topic {
  id: number;
  title: string;
  synopsis: string;
  start_at: string;
  end_at: string;
  views: number;
  isAdminRecommended?: boolean;
}

interface Comment {
  id: number;
  user: string;
  title: string;
  comments: number;
  created_at: string;
  rating: number;
  status: string;
  content?: string;
  likes?: number;
  replies?: number;
}

const TopicManagement: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'current' | 'past'>('current');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'popular' | 'showing' | 'recommended'>('all');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [expandedCommentId, setExpandedCommentId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAdminTopics({
        main: activeMainTab,
        filter: activeFilterTab,
        page: currentPage,
        size: itemsPerPage,
        sort: 'start_at',
        order: 'DESC',
      });

      const topics: Topic[] = response.data.items.map((item) => ({
        id: item.topic_id || 0,
        title: item.video?.title || '',
        synopsis: item.video?.synopsis || '',
        start_at: item.start_at ? new Date(item.start_at).toISOString().split('T')[0].replace(/-/g, '.') : '',
        end_at: item.end_at ? new Date(item.end_at).toISOString().split('T')[0].replace(/-/g, '.') : '',
        views: item.video?.views || 0,
        isAdminRecommended: item.is_admin_recommended || false,
      }));

      setAllTopics(topics);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('토픽 조회 실패:', error);
      setAllTopics([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [activeMainTab, activeFilterTab, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // 코멘트 목록 데이터
  const comments: Comment[] = [
    {
      id: 1,
      user: "Natali Craig",
      title: "코멘트 제목",
      comments: 23,
      created_at: "2025.10.08",
      rating: 5,
      status: "정상",
      content: "코멘트를 작성했습니다~",
      likes: 102,
      replies: 2,
    },
    {
      id: 2,
      user: "Andi Lane",
      title: "코멘트 제목",
      comments: 324,
      created_at: "2025.10.08",
      rating: 5,
      status: "정상",
    },
    {
      id: 3,
      user: "Natali Craig",
      title: "코멘트 제목",
      comments: 23,
      created_at: "2025.10.08",
      rating: 5,
      status: "정상",
    },
  ];

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleCommentExpand = (commentId: number) => {
    setExpandedCommentId(expandedCommentId === commentId ? null : commentId);
  };

  const handleCreate = async () => {
    if (activeFilterTab === 'recommended') {
      setIsCreateModalOpen(true);
      return;
    }

    if (activeFilterTab === 'popular' || activeFilterTab === 'showing') {
      setIsCreateModalOpen(true);
      return;
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSuccess = () => {
    fetchTopics();
    setSelectedTopic(null);
    setExpandedCommentId(null);
  };

  const handleEdit = () => {
    console.log('토픽 수정', selectedTopic);
  };

  const handleDelete = async () => {
    if (!selectedTopic) return;

    if (!confirm(`"${selectedTopic.title}" 토픽을 삭제하시겠습니까?\n\n삭제 후 자동으로 보충됩니다.`)) {
      return;
    }

    try {
      const { deleteAdminTopic } = await import('../../../services/api/topicApi');
      await deleteAdminTopic(selectedTopic.id);
      
      setTimeout(() => {
        fetchTopics();
        setSelectedTopic(null);
        setExpandedCommentId(null);
      }, 500);
    } catch (error) {
      console.error('토픽 삭제 실패:', error);
      alert('토픽 삭제에 실패했습니다.');
    }
  };

  const topicColumns = ["작품 제목", "작품 정보", "시작일", "종료일", "조회수"];
  const commentColumns = ["유저", "제목", "댓글", "작성일", "평점", "상태"];

  const showCreateButton = activeMainTab === 'current' && 
    (activeFilterTab === 'recommended' || activeFilterTab === 'popular' || activeFilterTab === 'showing');

  return (
    <div className="topic-management">
      <div className="admin-content">
        {/* 상단 탭 */}
        <div className="topic-management__tabs">
          <Tabs
            tabs={[
              { id: 'current', label: '현재 토픽' },
              { id: 'past', label: '역대 토픽' },
            ]}
            activeTab={activeMainTab}
            onTabChange={(tabId) => {
              setActiveMainTab(tabId as 'current' | 'past');
              setSelectedTopic(null);
              setExpandedCommentId(null);
              setCurrentPage(1);
            }}
            variant="underline"
            admin={true}
          />
        </div>

        {/* 필터 버튼 탭 */}
        <div className="topic-management__filter-tabs">
          <Tabs
            tabs={[
              { id: 'all', label: '전체 보기' },
              { id: 'popular', label: '전체인기작' },
              { id: 'showing', label: '현재상영작' },
              { id: 'recommended', label: '관리자추천' },
            ]}
            activeTab={activeFilterTab}
            onTabChange={(tabId) => {
              setActiveFilterTab(tabId as 'all' | 'popular' | 'showing' | 'recommended');
              setCurrentPage(1);
            }}
            variant="button"
            admin={true}
          />
        </div>

        {/* 작품 목록 테이블 */}
        <div className="topic-management__works-section">

          <div className="table topic-table">
            <ul className="header">
              {topicColumns.map((column) => (
                <li key={column}>{column}</li>
              ))}
            </ul>
            {allTopics.map((topic) => (
              <ul
                key={topic.id}
                className={`data ${selectedTopic?.id === topic.id ? 'selected' : ''}`}
                onClick={() => handleTopicClick(topic)}
              >
                <li>
                  <img src={Avatar} alt={topic.title} /> {topic.title}
                </li>
                <li>{topic.synopsis}</li>
                <li>{topic.start_at}</li>
                <li>{topic.end_at}</li>
                <li>{topic.views}</li>
              </ul>
            ))}
          </div>

          {/* 액션 버튼 */}
          <div className="topic-management__actions">
            <div className="topic-management__actions-left">
              {showCreateButton && (
                <Button
                  variant="info"
                  size="md"
                  onClick={handleCreate}
                  className="topic-management__create-btn"
                >
                  만들기
                </Button>
              )}
            </div>
            <div className="topic-management__actions-right">
              {selectedTopic && (
                <>
                  <ActionButton
                    action="edit"
                    onClick={handleEdit}
                    className="topic-management__edit-btn"
                  >
                    수정
                  </ActionButton>
                  <ActionButton
                    action="delete"
                    onClick={handleDelete}
                    className="topic-management__delete-btn"
                  >
                    삭제
                  </ActionButton>
                </>
              )}
            </div>
          </div>

          <StandardPagination 
            className="mt-4" 
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* 코멘트 목록 테이블 */}
        {selectedTopic && (
          <div className="topic-management__comments-section">
            <h2 className="topic-management__section-title">{selectedTopic.title}</h2>
            <CommentManagementFilter />

            <div className="table comment-table">
              <ul className="header">
                {commentColumns.map((column) => (
                  <li key={column}>{column}</li>
                ))}
              </ul>
              {comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <ul
                    className="data comment-row"
                    onClick={() => handleCommentExpand(comment.id)}
                    style={{ cursor: comment.content ? 'pointer' : 'default' }}
                  >
                    <li>
                      <img src={Avatar} alt={comment.user} /> {comment.user}
                    </li>
                    <li>{comment.title}</li>
                    <li>{comment.comments}</li>
                    <li>{comment.created_at}</li>
                    <li>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon
                            key={i}
                            icon="mdi:star"
                            style={{
                              color: i < comment.rating ? '#FFD700' : '#ccc',
                              width: '16px',
                              height: '16px',
                            }}
                          />
                        ))}
                      </div>
                    </li>
                    <li>{comment.status}</li>
                  </ul>
                  {expandedCommentId === comment.id && comment.content && (
                    <div className="comment-detail">
                      <div className="comment-detail__header">
                        <Icon icon="mdi:comment-text" />
                        <span>00님의 한마디</span>
                      </div>
                      <div className="comment-detail__content">
                        <p>{comment.content}</p>
                        <div className="comment-detail__meta">
                          <span>{comment.created_at}</span>
                          <span>좋아요 {comment.likes}개 댓글 {comment.replies}</span>
                        </div>
                        <div className="comment-detail__actions">
                          <button className="comment-detail__delete">삭제</button>
                          <button className="comment-detail__warning">경고</button>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <StandardPagination 
            className="mt-4" 
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
          </div>
        )}
      </div>

      {/* 토픽 생성 모달 */}
      {isCreateModalOpen && (
        <TopicManagementModalComponent
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          mode="create"
          sourceType={activeFilterTab === 'all' ? 'recommended' : activeFilterTab}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default TopicManagement;

