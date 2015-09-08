class StakeholderMessage < ActiveRecord::Base
  belongs_to :step
  mount_uploader :media, MediaUploader
end
