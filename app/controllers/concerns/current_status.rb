module CurrentStatus
  extend ActiveSupport::Concern

  private

    def set_status(id)
      session[:status_id] = id
    end

    def get_status
      @status = Status.find(session[:status_id])
    end


end