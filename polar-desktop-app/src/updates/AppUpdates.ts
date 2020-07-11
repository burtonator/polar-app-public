import {Platform, Platforms} from 'polar-shared/src/util/Platforms';

export class AppUpdates {

    public static platformSupportsUpdates() {

        // TODO: in the future we might want to distribute in the Windows app
        // store but they accept PWAs so we can just distribute that way
        // which would be 100x easier but Anki sync wouldn't work.  We aren't
        // allowed to enable updates on that platform though and have to use
        // their update system.
        return [Platform.MACOS, Platform.WINDOWS].includes(Platforms.get());

    }

}
