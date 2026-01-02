const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Member, Setting } = require('../models');
const MemberRepository = require('../repositorys/member.repository');
const memberRepository = new MemberRepository(Member);
const SettingRepository = require('../repositorys/setting.repository');
const settingRepository = new SettingRepository(Setting);

module.exports = async () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_OAUTH_CLIENT,
        clientSecret: process.env.GOOGLE_OAUTH_SECRET,
        callbackURL: "/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0]?.value || profile._json.email;
                if (!email) {
                    return done(new Error("이메일 정보를 가져올 수 없습니다."));
                }
                //기존 가입 이력이 있으면, 해당 정보를 가져옴
                const existingUser = await memberRepository.findByEmail(email);
                if(existingUser) {
                    return done(null, existingUser);
                }
                const member = await memberRepository.createMember({
                    email: email,
                    password: ""
                })
                await settingRepository.createSetting(member.id)
                
                return done(null, member);
            } catch (error) {
                return done(error);
            }
        }
    ));
}
