import React, { useState, useRef } from 'react';
import { communityApi, CreatePostData } from '../../api/community';
import { Post } from '../../types';
import { Modal, Button, Input, Textarea, Alert } from '../ui';
import { Image as ImageIcon, X } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (post: Post) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().replace(/^#/, '').toLowerCase();
      if (tag && !tags.includes(tag) && tags.length < 10) {
        setTags([...tags, tag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Post content is required.');
      return;
    }
    setError('');
    setLoading(true);

    const data: CreatePostData = {
      content: content.trim(),
      title: title.trim() || undefined,
      tag_names: tags,
      image: image || undefined,
    };

    try {
      const post = await communityApi.createPost(data);
      onCreated(post);
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
      setImage(null);
      setImagePreview(null);
      onClose();
    } catch {
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a New Post"
      description="Share your progress, tips, or motivation with the community."
      footer={
        <div className="d-flex gap-3 justify-content-end w-100">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>
            Publish Post
          </Button>
        </div>
      }
    >
      {error && (
        <Alert variant="error" className="mb-3" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <Input
          label="Post Title (optional)"
          placeholder="e.g. My 6-month transformation story"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          label="Content *"
          placeholder="What's on your mind? Use @username to mention someone…"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* Tag input */}
        <div>
          <label className="form-label text-secondary text-xs mb-1 fw-semibold uppercase tracking-wider">
            Tags (press Enter to add)
          </label>
          <div className="d-flex align-items-center gap-2 flex-wrap p-2 rounded-3"
               style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', minHeight: 44 }}>
            {tags.map((tag) => (
              <span key={tag}
                    className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill text-warning text-xs fw-semibold"
                    style={{ background: 'rgba(243,97,0,0.15)' }}>
                #{tag}
                <button type="button" onClick={() => removeTag(tag)}
                        className="btn btn-link p-0 text-secondary text-decoration-none" style={{ lineHeight: 1 }}>
                  <X size={11} />
                </button>
              </span>
            ))}
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                   onKeyDown={handleAddTag}
                   placeholder={tags.length === 0 ? '#strength, #hiit…' : ''}
                   className="border-0 bg-transparent text-white text-sm flex-grow-1"
                   style={{ outline: 'none', minWidth: 120 }} />
          </div>
        </div>

        {/* Image attachment */}
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="d-none"
                 onChange={handleImageChange} />

          {imagePreview ? (
            <div className="position-relative">
              <img src={imagePreview} alt="preview" className="w-100 rounded-3 object-cover"
                   style={{ maxHeight: 200, objectFit: 'cover' }} />
              <button type="button" onClick={() => { setImage(null); setImagePreview(null); }}
                      className="btn btn-sm position-absolute top-0 end-0 m-2 rounded-pill"
                      style={{ background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff' }}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()}
                    className="btn w-100 text-secondary d-flex align-items-center justify-content-center gap-2 py-3 rounded-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)' }}>
              <ImageIcon size={18} /> Attach Photo (optional)
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default CreatePostModal;
