package com.roamsetup;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.roam.reactnative.RNRoamReceiver;
/**
 * This service is responsible for registering a broadcast receiver to listen for location updates
 * from the Roam SDK and potentially other events.
 */

public class LocationService extends Service {

    private RNRoamReceiver mLocationReceiver;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    /**
     * Called when the service is first created.
     * Initializes the location receiver if running on Android O (API level 26) or higher.
     */
    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            register();
        }
    }

    /**
     * Called when the service is started by a call to startService.
     * Sets the service to be restarted if it is terminated abnormally.
     */
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    /**
     * Called when the service is destroyed.   
     * Unregisters the location receiver.
     */
    @Override
    public void onDestroy() {
        unRegister();
        super.onDestroy();
    }

    /**
     * Registers the RNRoamReceiver for location updates and boot completion events.
     * Uses Context.RECEIVER_EXPORTED for API level 33 (Tiramisu) and above for improved security.
     */
    @RequiresApi(api = Build.VERSION_CODES.O)
    private void register() {
        mLocationReceiver = new RNRoamReceiver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("com.roam.android.RECEIVED");
        intentFilter.addAction("android.intent.action.BOOT_COMPLETED");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(mLocationReceiver, intentFilter, Context.RECEIVER_EXPORTED);
        }
        else {
            registerReceiver(mLocationReceiver, intentFilter);
        }
    }

    /**
     * Unregisters the location receiver to prevent resource leaks.
     */
    private void unRegister() {
        if (mLocationReceiver != null) {
            unregisterReceiver(mLocationReceiver);
        }
    }

}