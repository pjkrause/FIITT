module CurrentStatus
  extend ActiveSupport::Concern

  private

    def set_status
      @status = Status.find(session[:status_id])
    rescue
      @status = Status.create
      session[:status_id] = @status.id
    end

end