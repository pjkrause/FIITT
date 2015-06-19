class StakeholderMessagesController < ApplicationController
  before_action :set_stakeholder_message, only: [:show, :edit, :update, :destroy]

  # GET /stakeholder_messages
  # GET /stakeholder_messages.json
  def index
    @stakeholder_messages = StakeholderMessage.all
  end

  # GET /stakeholder_messages/1
  # GET /stakeholder_messages/1.json
  def show
  end

  # GET /stakeholder_messages/new
  def new
    @stakeholder_message = StakeholderMessage.new
  end

  # GET /stakeholder_messages/1/edit
  def edit
  end

  # POST /stakeholder_messages
  # POST /stakeholder_messages.json
  def create
    @stakeholder_message = StakeholderMessage.new(stakeholder_message_params)

    respond_to do |format|
      if @stakeholder_message.save
        format.html { redirect_to @stakeholder_message, notice: 'Stakeholder message was successfully created.' }
        format.json { render :show, status: :created, location: @stakeholder_message }
      else
        format.html { render :new }
        format.json { render json: @stakeholder_message.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /stakeholder_messages/1
  # PATCH/PUT /stakeholder_messages/1.json
  def update
    respond_to do |format|
      if @stakeholder_message.update(stakeholder_message_params)
        format.html { redirect_to @stakeholder_message, notice: 'Stakeholder message was successfully updated.' }
        format.json { render :show, status: :ok, location: @stakeholder_message }
      else
        format.html { render :edit }
        format.json { render json: @stakeholder_message.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /stakeholder_messages/1
  # DELETE /stakeholder_messages/1.json
  def destroy
    @stakeholder_message.destroy
    respond_to do |format|
      format.html { redirect_to stakeholder_messages_url, notice: 'Stakeholder message was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stakeholder_message
      @stakeholder_message = StakeholderMessage.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def stakeholder_message_params
      params.require(:stakeholder_message).permit(:step_id, :source, :message)
    end
end
