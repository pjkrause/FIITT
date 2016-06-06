# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160606215708) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "hstore"
  enable_extension "pg_stat_statements"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string   "namespace"
    t.text     "body"
    t.string   "resource_id",   null: false
    t.string   "resource_type", null: false
    t.integer  "author_id"
    t.string   "author_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "active_admin_comments", ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
  add_index "active_admin_comments", ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
  add_index "active_admin_comments", ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id", using: :btree

  create_table "admin_users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "admin_users", ["email"], name: "index_admin_users_on_email", unique: true, using: :btree
  add_index "admin_users", ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true, using: :btree

  create_table "decisions", force: :cascade do |t|
    t.text     "choice"
    t.integer  "rt"
    t.integer  "ec"
    t.integer  "ic"
    t.integer  "mp"
    t.integer  "pp"
    t.integer  "days"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.float    "x_position", default: 0.0
    t.float    "y_position", default: 0.0
    t.integer  "game_id"
  end

  create_table "games", force: :cascade do |t|
    t.string   "title"
    t.text     "description"
    t.integer  "first_step"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.float    "x_position",     default: 0.0
    t.float    "y_position",     default: 0.0
    t.float    "pan_x_position", default: 0.0
    t.float    "pan_y_position", default: 0.0
    t.float    "zoom",           default: 0.0
  end

  create_table "outcomes", force: :cascade do |t|
    t.integer  "step_id"
    t.integer  "decision_ids",    default: [],                     array: true
    t.integer  "outcome_step_id"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "colour",          default: "#000000"
  end

  create_table "players", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "players", ["email"], name: "index_players_on_email", unique: true, using: :btree
  add_index "players", ["reset_password_token"], name: "index_players_on_reset_password_token", unique: true, using: :btree

  create_table "stakeholder_messages", force: :cascade do |t|
    t.integer  "step_id"
    t.string   "source"
    t.text     "message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "media"
    t.string   "video"
  end

  create_table "statuses", force: :cascade do |t|
    t.integer  "crt",                    default: 0
    t.integer  "external_communication", default: 0
    t.integer  "internal_communication", default: 0
    t.integer  "media_perception",       default: 0
    t.integer  "public_perception",      default: 0
    t.integer  "day_no",                 default: 0
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.integer  "player_id"
    t.integer  "game_id"
    t.boolean  "completed",              default: false
    t.hstore   "trace",                  default: {},    null: false
  end

  create_table "steps", force: :cascade do |t|
    t.text     "general_message"
    t.text     "status_message"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.integer  "game_id"
    t.hstore   "decision_table",  default: {},  null: false
    t.text     "guidance"
    t.integer  "default_step"
    t.float    "x_position",      default: 0.0
    t.float    "y_position",      default: 0.0
  end

end
