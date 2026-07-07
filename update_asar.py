import shutil, os, subprocess, sys, time

project_dir = r'C:\Users\fuxiaomin\auto-parts-learning'
new_dist = os.path.join(project_dir, 'dist')
asar_path = os.path.join(project_dir, 'release', 'win-unpacked', 'resources', 'app.asar')
asar_cmd = os.path.join(project_dir, 'node_modules', '.bin', 'asar.cmd')
temp_dir = os.path.join(os.environ['TEMP'], 'asar_update_lighting')

# Clean temp
if os.path.exists(temp_dir):
    shutil.rmtree(temp_dir)
os.makedirs(temp_dir, exist_ok=True)

print("Step 1: Extracting app.asar...")
subprocess.run([asar_cmd, 'extract', asar_path, temp_dir], capture_output=True, check=True)

# Update dist folder inside asar
asar_dist = os.path.join(temp_dir, 'dist')
if os.path.exists(asar_dist):
    shutil.rmtree(asar_dist)

print("Step 2: Copying new dist files...")
shutil.copytree(new_dist, asar_dist)

# Repack
new_asar = os.path.join(os.environ['TEMP'], 'new_app.asar')
if os.path.exists(new_asar):
    os.remove(new_asar)

print("Step 3: Repacking app.asar...")
subprocess.run([asar_cmd, 'pack', temp_dir, new_asar], capture_output=True, check=True)
shutil.copy2(new_asar, asar_path)

print("Step 4: Cleaning up...")
os.remove(new_asar)
shutil.rmtree(temp_dir)

print("OK app.asar updated successfully!")
print("Changes are now in the desktop app.")