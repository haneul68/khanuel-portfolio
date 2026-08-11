$source = "C:\Users\A\Documents\Codex\2026-07-04\dnpq\outputs\khanuel-chaos-arena-update-20260811"
$target = "C:\Users\A\Desktop\Steam_Game_D\khanuel-portfolio"
Copy-Item -LiteralPath "$source\app.js" -Destination "$target\app.js" -Force
Copy-Item -LiteralPath "$source\assets\project-chaos-assassin-basic.png" -Destination "$target\assets\project-chaos-assassin-basic.png" -Force
Copy-Item -LiteralPath "$source\assets\project-chaos-brute-basic.png" -Destination "$target\assets\project-chaos-brute-basic.png" -Force
Copy-Item -LiteralPath "$source\assets\project-chaos-character-select.png" -Destination "$target\assets\project-chaos-character-select.png" -Force
Copy-Item -LiteralPath "$source\assets\project-chaos-dash-f.png" -Destination "$target\assets\project-chaos-dash-f.png" -Force
Copy-Item -LiteralPath "$source\assets\project-chaos-ingame-ui.png" -Destination "$target\assets\project-chaos-ingame-ui.png" -Force
Copy-Item -LiteralPath "$source\assets\project-chaos-lobby.png" -Destination "$target\assets\project-chaos-lobby.png" -Force
Copy-Item -LiteralPath "$source\assets\project-chaos-main.png" -Destination "$target\assets\project-chaos-main.png" -Force
Copy-Item -LiteralPath "$source\assets\project-chaos-room-create.png" -Destination "$target\assets\project-chaos-room-create.png" -Force
Copy-Item -LiteralPath "$source\assets\project-chaos-skill-e.png" -Destination "$target\assets\project-chaos-skill-e.png" -Force
Copy-Item -LiteralPath "$source\assets\project-chaos-skill-q.png" -Destination "$target\assets\project-chaos-skill-q.png" -Force
Copy-Item -LiteralPath "$source\assets\project-chaos-skill-r.png" -Destination "$target\assets\project-chaos-skill-r.png" -Force
Write-Output "Chaos Arena portfolio update copied. Open GitHub Desktop, commit, and push."
