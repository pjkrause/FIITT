class StakeholderMessage < ActiveRecord::Base
  belongs_to :step
  mount_uploader :media, MediaUploader
  mount_uploader :video, VideoUploader
end
